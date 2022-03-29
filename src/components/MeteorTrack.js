import { Table, Input, Image, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import React from 'react';

class MeteorTrack extends React.Component {
  state = {
    filteredInfo: null,
    sortedInfo: null,
    DataisLoaded: false,
    items: [],

    searchText: '',
	searchedColumn: '',
  };
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
        .catch((error) => {
            console.error('Error:', error);
          });
}

  handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };



  clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null,
    });
  };

 //search in name column 
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
            Filter
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

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };


  render() {
    let { sortedInfo, filteredInfo, DataisLoaded, items } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    if (!DataisLoaded) 
    return <div >
		        <Image src="./Loading.gif" alt="Big head turning around itself as a loading picture." preview={false}/>
            </div> ;

    const columns = [
      {
        key: 'name',
        title: 'Name',
        dataIndex: 'name',
        
        ...this.getColumnSearchProps('name'),
        filteredValue: filteredInfo.name || null,
      },
      
      {
        key: 'nametype',
        title: 'Nametype',
        dataIndex: 'nametype',
        
        filters: [
            {text: 'Valid', value: 'Valid', },
            { text: 'Relict', value: 'Relict',},
        ],
        filteredValue: filteredInfo.nametype || null,
        onFilter: (value, record) => record.nametype.includes(value),
      },
      {
        key: 'recclass',
        title: 'Recclass',
        dataIndex: 'recclass',
        
        },
      {
        key: 'mass',
        title: 'Mass (g)',
        dataIndex: 'mass',
        
        sorter: (a, b) => a.mass - b.mass,
        sortOrder: sortedInfo.columnKey === 'mass' && sortedInfo.order,
      },
      {
        key: 'fall',
        title: 'Fall',
        dataIndex: 'fall',
        
        filters: [
            { text: 'Found', value: 'Found', },
            { text: 'Fell', value: 'Fell', },
        ],
        filteredValue: filteredInfo.fall || null,
        onFilter: (value, record) => record.fall.indexOf(value) === 0,

      },
      {
        key: 'year',
        title: 'Year',
        dataIndex: 'year',
        
        render:  (text, row, index) => <p>{text.substring(0,4)}</p>,
      },
      {
        key: 'reclat',
        title: 'Latitude',
        dataIndex: 'reclat',
        
      },
      {
        key: 'reclong',
        title: 'Longitude',
        dataIndex: 'reclong',
        
      },
    ];
    return (
      < >
      <Image width={180} src="./MeteorLogo.png" alt="Meteorite explorer site logo" preview={false}/>
        <h1> Meteroite Explorer</h1> 
        <Space style={{ marginBottom: 16 }}>
          <Button onClick={this.clearFilters}>Clear filters</Button>
          <Button onClick={this.clearAll}>Clear filters and sorters</Button>
        </Space>
        <Table rowKey="id"  style={{ marginLeft: 16 , marginRight: 16 ,}} columns={columns} dataSource={items} onChange={this.handleChange} />
      </>
    );
  }
}
export default MeteorTrack;
