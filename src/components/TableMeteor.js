import React from "react";
import { Table, Input, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

function onChange(pagination, filters, sorter, extra) {
	console.log('params', pagination, filters, sorter, extra);
  }
class TableMeteor extends React.Component {

	// Constructor
	constructor(props) {
		super(props);

		this.state = {
			items: [],
			DataisLoaded: false,
			searchText: '',
			searchedColumn: '',
		};
	}

	componentDidMount() {
		fetch(
"https://data.nasa.gov/resource/gh4g-9sfh.json")
			.then((res) => res.json())
			.then((json) => {
				this.setState({
					items: json,
					DataisLoaded: true
				});
			})
	}
	
	
	  getColumnSearchProps = dataIndex => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
		  <div style={{ padding: 8 }}>
			<Input
			  ref={node => {
				this.searchInput = node;
			  }}
			  placeholder={`Search ${dataIndex}`}
			  value={selectedKeys[0]}
			  onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
			  onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
			  style={{ marginBottom: 8, display: 'block' }}
			/>
			<Space>
			  <Button
				type="primary"
				onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
				icon={<SearchOutlined />}
				size="small"
				style={{ width: 90 }}
			  >
				Search
			  </Button>
			  <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
				Reset
			  </Button>
			  <Button
				type="link"
				size="small"
				onClick={() => {
				  confirm({ closeDropdown: false });
				  this.setState({
					searchText: selectedKeys[0],
					searchedColumn: dataIndex,
				  });
				}}
			  >
				Ok
			  </Button>
			</Space>
		  </div>
		),
		filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
		onFilter: (value, record) =>
		  record[dataIndex]
			? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
			: '',
		onFilterDropdownVisibleChange: visible => {
		  if (visible) {
			setTimeout(() => this.searchInput.select(), 100);
		  }
		},
		render: text =>
		this.state.searchedColumn === dataIndex ? (
		  <Highlighter
			highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
			searchWords={[this.state.searchText]}
			autoEscape
			textToHighlight={text ? text.toString() : ''}
		  />
		) : (
		  text
		),
	});
  
	handleSearch = (selectedKeys, confirm, dataIndex) => {
	  confirm();
	  this.setState({
		searchText: selectedKeys[0],
		searchedColumn: dataIndex,
	  });
	};
  
	handleReset = (clearFilters) => {
	  clearFilters();
	  this.setState({ searchText: '' ,searchedColumn: '',});
	};
	clearFilters = () => {
		this.setState({ 
			searchText: null,
		 });
	  };
	
	
	render() {
		const { DataisLoaded, items } = this.state;


		if (!DataisLoaded) return <div>
			<h1> Please wait some time.... </h1> </div> ;
		const columns = [
			{
			  title: 'Name',
			  dataIndex: 'name',
			  key: 'name',
			  ...this.getColumnSearchProps('name'),
			},
			{
			  title: 'id',
			  dataIndex: 'id',
			  key: 'id',
			},
			{
			  title: 'nametype',
			  dataIndex: 'nametype',
			  key: 'nametype',
			  filters: [
				{
					text: 'Valid',
					value: 'Valid',
				  },
				  {
					text: 'Relict',
					value: 'Relict',
				  },
			  ],
			  onFilter: (value, record) => record.nametype.indexOf(value) === 0,

			},
			{
			  title: 'recclass',
			  dataIndex: 'recclass',
			  key: 'recclass',
			},
			{
			  title: 'mass',
			  dataIndex: 'mass',
			  key: 'mass',
			},
			{
			  title: 'fall',
			  dataIndex: 'fall',
			  key: 'fall',
			  filters: [
				{
					text: 'Found',
					value: 'Found',
				  },
				  {
					text: 'Fell',
					value: 'Fell',
				  },
			  ],
			  onFilter: (value, record) => record.fall.indexOf(value) === 0,

			},
			{
			  title: 'year',
			  dataIndex: 'year',
			  key: 'year',
			},
			{
			  title: 'latitude',
			  dataIndex: 'reclat',
			  key: 'reclat',
			},
			{
			  title: 'longitude',
			  dataIndex: 'reclong',
			  key: 'reclong',
			},
		  ];
		return (
		<div >
			<h1> Meteroite Explorer</h1> 
			<Space style={{ marginBottom: 16 }}>
				<Button onClick={this.handleReset}>Clear filters</Button>
			</Space>
			<Table columns={columns} dataSource={items}  onChange={onChange} />
		</div>
	);
}
}

export default TableMeteor;
