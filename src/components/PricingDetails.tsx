import * as React from 'react'
import { useFunctionContext } from '../context/FunctionContext'
import { Box, Slider, Typography, styled, Button, Radio, FormControl, FormLabel, RadioGroup, FormControlLabel, TextField, FormHelperText, Select, Tabs, Tab, Stack } from '@mui/material'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import * as dayjs from 'dayjs';

interface PricingDetailsProps {
  defaultFunctionConfig: any,
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const StyledTab = styled(Tab)({
  "&.Mui-selected": {
    color: "#7f9f80"
  }
})

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const PricingDetails = ({ defaultFunctionConfig }: PricingDetailsProps) => {
  const { functionName } = useFunctionContext();
  const [type, setType] = React.useState(defaultFunctionConfig.type);
  const [memorySize, setMemorySize] = React.useState(defaultFunctionConfig.memorySize);
  const [storage, setStorage] = React.useState(defaultFunctionConfig.storage);
  const [billedDurationAvg, setBilledDurationAvg] = React.useState(1);
  const [invocationsTotal, setInvocationsTotal] = React.useState(1);
  const [pricing, setPricing] = React.useState(0);
  const [showPricing, setShowPricing] = React.useState(false);
  const [value, setValue] = React.useState(0);
  // const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-07'));

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    // post request to backend for pricing calculator
    const body = {
      functionName: functionName,
      type: type,
      memorySize: memorySize,
      storage: storage,
      billedDurationAvg: billedDurationAvg,
      invocationsTotal: invocationsTotal
    }
    fetch('http://localhost:3000/price', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
      })
      .then((res) => res.json())
      .then((data) => {
        setPricing(data);
        setShowPricing(true);
        })
        .catch((err) => {
          console.log('Error fetching pricing calc:', err);
        });
  }

  // post request to backend for pricing history
  // const handleSubmit2 = (event: React.SyntheticEvent) => {
  //   event.preventDefault();
  //   const body = {
  //     functionName: functionName,
  //     type: type,
  //     billedDurationAvg: billedDurationAvg,
  //     invocationsTotal: invocationsTotal, 
  //     date: date,
  //   }
  //   fetch('http://localhost:3000/priceHistory', {
  //     method: 'POST',
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(body)
  //     })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setPricing(data);
  //       setShowPricing(true);
  //       })
  //       .catch((err) => {
  //         console.log('Error fetching pricing history:', err);
  //       });
  // }

  const financial = (num: any) => {
    return new Intl.NumberFormat().format(num);
  }


  return (
    <div className='p-5 flex flex-col text-gray-900 dark:text-[#D3D4D4]'>

      {/* PRICING CALCULATOR */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', marginTop: 5 }}>
        <Tabs 
          TabIndicatorProps={{style: {background: '#7f9f80'}}}
          value={value}
          onChange={handleChange}>
          <StyledTab label="Calculator" {...a11yProps(0)} />
          <StyledTab label="History" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
      <p className='text-gray-700 dark:text-[#D3D4D4] text-lg'>Viewing price calculator for:</p>
      <p className='text-gray-900 dark:text-[#D3D4D4] text-4xl mb-2.5'>{functionName}</p>
      <p className='text-gray-700 dark:text-[#D3D4D4] text-md mt-10'>Configure your function below to estimate how much it will cost you per month. The default values are your function's current configuration.</p>

      <br></br>
    
    <Box sx={{ width: '70%', m: 3 }}>
    <FormControl>
      <Typography gutterBottom>Type:</Typography>
      <RadioGroup
        aria-labelledby="Type"
        defaultValue="Arm"
        name="radio-buttons-group"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <FormControlLabel value="Arm" control={<Radio sx={{
          '&, &.Mui-checked': {
            color: '#7f9f80',
          },
        }}/>} label="Arm" 
        />
        <FormControlLabel value="x86_64" control={<Radio sx={{
          '&, &.Mui-checked': {
            color: '#7f9f80',
          },
        }}/>} label="x86_64" 
        />
      </RadioGroup>
    </FormControl>

    <Box sx={{ m: 3 }} />
      <Typography gutterBottom>Memory Size (MB):</Typography>
      <Slider 
        sx={{color:"#9cb59d"}}
        aria-label="default"
        valueLabelDisplay="auto"
        value={memorySize}
        min={128}
        max={10240}
        onChange={(e, value) => setMemorySize(value as number)}
      />

    <Box sx={{ m: 3 }} />
      <Typography gutterBottom>Storage Size (MB):</Typography>
      <Slider 
        sx={{color:"#9cb59d"}}
        aria-label="default"
        valueLabelDisplay="auto"
        value={storage}
        min={512}
        max={10240}
        onChange={(e, value) => setStorage(value as number)}
      />

    <Box sx={{ m: 3 }} />
      <Typography gutterBottom>Billed Duration:</Typography>
      <Slider 
        sx={{color:"#9cb59d"}}
        aria-label="default"
        valueLabelDisplay="auto"
        value={billedDurationAvg}
        min={1}
        max={90000}
        onChange={(e, value) => setBilledDurationAvg(value as number)}
      />

    <Box sx={{ m: 3 }} />
      <Typography gutterBottom>Total Invocations:</Typography>
      <TextField 
        type="number"
        className="w-auto" 
        id="outlined-basic" 
        value={invocationsTotal} 
        placeholder="100000000000" 
        variant="outlined" 
        onChange={(e) => setInvocationsTotal(Number(e.target.value))
        } 
      />
    </Box> 

    <div className="flex w-11/12">
      <Button className="dark:bg-[#7f9f80] dark:hover:bg-[#BFBFBF] dark:hover:text-[#242424]"
        variant="outlined"
        disableElevation
        sx={{
          width: '20%',
          m: 2.7, 
          backgroundColor: "#9cb59d",
          borderColor: "#9cb59d",
          color: "#FFFFFF",
          '&:hover': {
            borderColor: '#9cb59d',
            backgroundColor: '#F5F5F5',
            color: '#9cb59d'
            }
          }}
        size="small"
        onClick={handleSubmit}
          >Calculate Price
      </Button>

      {showPricing && (
        <p className='text-gray-700 dark:text-[#D3D4D4] mt-3.5 text-4xl'>${financial(pricing)}</p>
      )}
    </div>
    </TabPanel>


    {/* PRICING HISTORY */}
    <TabPanel value={value} index={1}>
      <p className='text-gray-700 dark:text-[#D3D4D4] text-lg'>Viewing price history for:</p>
      <p className='text-gray-900 dark:text-[#D3D4D4] text-4xl mb-2.5'>{functionName}</p>
      
      <Typography gutterBottom>Billed month:</Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3}>
        {/* <DatePicker
          views={['year', 'month']}
          label="Year and Month"
          minDate={dayjs('2012-03-01')}
          maxDate={dayjs('2023-06-01')}
          value={value}
          renderInput={(params) => <TextField {...params} helperText={null} />}
        /> */}
      </Stack>
    </LocalizationProvider>
    </TabPanel>

  </div>
  )
}

export default PricingDetails

//req.body will have these props:
  //type: "x86_64" or "Arm"
  //memorySize: 128 //must be b/w 128 and 10240 (10gb)
  //storage: 512 (number) //must be between 512 to 10240
  //billedDurationAvg: Number //must be b/w 1 to 900000
  //invocationsTotal: Number //must be b/w 1 to 1e+21
