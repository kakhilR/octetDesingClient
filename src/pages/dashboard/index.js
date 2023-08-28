import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ApexChart from '../../components/charts/chart';
import Job from '../../components/job';
import StatusTab from '../../components/tab';
// import ActiveJobData from '../../data/activeJobData';
import './style.scss';

export default function Footer() {
	const [time, setTime] = useState(1);
	const [sort, setSort] = useState('recent');
  const [activeJobData, setActiveJobData] = useState([]);
  const [jobStatData, setJobStatData] = useState([])

  const received =  jobStatData.map(r=>r.received)
  const applied = jobStatData.map(a=>a.applied)
	const [countReceived, setCountReceived] = useState([received]);
	const [countApplied, setCountApplied] = useState([applied]);
	const handleChange = (event) => {
		setSort(event.target.value);
		handleSorting(event.target.value)
	};

   useEffect(()=>{
    getJobData();
    getJobStatsData();
  },[])
  
  const getJobData = ()=>{
    axios.get('https://octetdesignserver-production.up.railway.app/api/jobs',{
      headers:{}
    }).then((response)=>{
      console.log(response.data,"jobs");
      setActiveJobData(response.data.jobs);
    }).catch((error)=>{
      console.log(error);
    });
  }

  const getJobStatsData = ()=>{
    axios.get('https://octetdesignserver-production.up.railway.app/api/stats',{
      headers:{}
    }).then((response)=>{
      setJobStatData(response.data.jobStats);
    }).catch((error)=>{
      console.log(error);
    });
  }
  
	useEffect(() => {
		if (time === 0) {
			setCountReceived(received.slice(0, 7));
			setCountApplied(applied.slice(0, 7));
		} else {
			setCountReceived(received);
			setCountApplied(applied);
		}
	}, [time]);
  
	const ApexChartWrapper = () => {
		return <ApexChart countReceived={countReceived.length>0 ? countReceived:received} countApplied={countApplied.length>0 ? countApplied : applied} />;
	};

	const [data, setData] = useState(activeJobData);
console.log(data,"data")
	const [sortCriteria, setSortCriteria] = useState('');
	const sortData = (array, criteria) => {
		const sortedArray = [...array];
		switch (criteria) {
		case 'name':
			sortedArray.sort((a, b) => a.name.localeCompare(b.name));
			break;
		case 'recent':
			sortedArray.sort((a, b) => new Date(b.dateFormat) - new Date(a.dateFormat));
			break;
		default:
			break;
		}
		return sortedArray;
	};
	const handleSorting = (criteria) => {
		setSortCriteria(criteria);
	
		const sortedData = sortData(data, criteria);
		setData(sortedData);
	};
  
  return (
    <div className="home-page">
      <div className="page-header">
        <div className="container">
          <h1>Hello, Paramedic Medical Supplies</h1>
          <Button variant="contained" onClick={() => alert('Want to post a job?')}>
            Post a Job
          </Button>
          <div className="tabs">
		  	<StatusTab name="Active Jobs" count={180} />
            <StatusTab name="New Application" count={180} />
            <StatusTab name="Candidate To Be Reviewed" count={22} />
            <StatusTab name="Shortlisted" count={178} />
          </div>
        </div>
      </div>
      <div className="main-page">
        <div className="container">
          <h2>Applications Received</h2>
          <ButtonGroup variant="contained">
            <Button
              style={time === 0 ? { color: '#6390DF', fontWeight: '700', backgroundColor: '#F5F8FE' } : {}}
              onClick={() => {
                setTime(0);
              }}
            >
              Weekly
            </Button>
            <Button
              style={time === 1 ? { color: '#6390DF', fontWeight: '700', backgroundColor: '#F5F8FE' } : {}}
              onClick={() => {
                setTime(1);
              }}
            >
              Monthly
            </Button>
          </ButtonGroup>
        </div>
        <div className="container chart">
          <div className="chart-container">
			<ApexChartWrapper  countReceived={countReceived.length>0 ? countReceived:received} countApplied={countApplied.length>0 ? countApplied : applied} />
          </div>
        </div>
        <div className="container">
          <h2>Active Jobs </h2>
          <div className="select">
            <p>Sort By: </p>
            <Select displayEmpty inputProps={{ 'aria-label': 'Without label' }} value={sort} onChange={handleChange}>
              <MenuItem value={'recent'}>Recent</MenuItem>
              <MenuItem value={'name'}>Name</MenuItem>
            </Select>
          </div>
        </div>
		<div className="container">
			<div className="jobs">
        {data.length > 0 ? data.map((item, index) => (
          <Job key={index} data={item} />
				)) : activeJobData.map((item, index) => (
          <Job key={index} data={item} />
				))}
				
			</div>
		</div>
      </div>
    </div>
  );
}
