'use client';

import React, { useState } from "react";

import { Typography } from "../../components/Typography/Typography";
import { Button } from "../../components/Button/Button";
import { RowType, Table } from "../../components/Table/Table";
import { VideoModel, VideoTypes } from "../../models/VideoModel";
import moment from "moment";
import CSVUpload from "../../components/CVSUpload/CSVUpload";
import { RokuAvailsMaster } from "../../utils/masters/RokuAvailsMaster";
import { generateTemplate } from "../../services/generateTemplate";
import TextInput from "../../components/Inputs/TextInput/TextInput";
import { Checkbox } from "../../components/Inputs/Checkbox/Checkbox";
import outputMasters from "../../utils/masters/outputMasters";

import './generateTemplate.scss';
import { SelectInput, SelectOption } from "../../components/Inputs/SelectInput/SelectInput";

type TableFilters = {
    distributor: string
    title: string
    brandedVOD: boolean
    unbrandedVOD: boolean
    thirdPartyLinear: boolean
}

type SelectVideoModel = VideoModel & {selected: boolean}

const Page = ( ) => {

    const [videos, setVideos] = useState<SelectVideoModel[]>([]);
    const [filters, setFilters] = useState<TableFilters>({
        distributor: '',
        title: '',
        brandedVOD: false,
        unbrandedVOD: false,
        thirdPartyLinear: false
    })

    const [masterId, setMasterId] = useState('')

    const handleUploadVideos = (videos: VideoModel[]) => {
        const selectableVideos = videos.map(video => ({...video, selected: false}));
        setVideos(selectableVideos);
    }

    const videoToRow = (video: VideoModel) => {
        let row = {} as RowType;

        Object.keys(video).forEach(key => {
            if ( video[key] == null ) row[key] = ''
            else if ( typeof video[key] == 'number') row[key] = video[key].toString()
            else if ( typeof video[key] == 'object') row[key] = moment(video[key]).format('MM-DD-YYYY')
            else if ( typeof video[key] == 'boolean' && key != 'selected') row[key] = video[key] ? 'Yes' : 'No'
            else row[key] = video[key]
        })

        row.id = video.guid;

        return row;
    }
    
    const handleSelectVideos = (o: {rows: string[], selected}) => {
        const { rows, selected } = o;

        const newVideos = [...videos];

        //To do: optimize this
        rows.forEach(row => {
            const video = newVideos.find(video => video.guid === row);
            if (video) video.selected = selected;
        })

        setVideos(newVideos)
    }

    const handleGenerateTemplate = () => {

        if (!masterId || masterId == '') {
            alert('Please select an export type');
            return
        };

        const master = outputMasters.find(master => master.id === masterId);
        const selectedVideos = videos.filter(video => video.selected);

        if (!master) return;

        const tableContent = generateTemplate(master, selectedVideos);

        downloadCsv(tableContent);
    }

    const downloadCsv = (tableContent: any[]) => {
        const csvContent = tableContent.map(row => row.join(',')).join('\n')

        const blob = new Blob([csvContent], {type: 'text/csv'})
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'data.csv'
        a.click()
    }

    const handleTextFilters = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        setFilters({...filters, [key]: e.target.value})
    }

    const handleCheckboxFilters = (value: boolean, key: string) => {
        setFilters({...filters, [key]: value})
    }

    const handleSelectMaster = (o: SelectOption) => {
        setMasterId(o.value as string)
    }

    const applyFilters = (video: VideoModel) => {
        if (filters.distributor && video.distributor.toLowerCase().indexOf(filters.distributor.toLowerCase()) === -1) return false;
        if (filters.title && video.title.toLowerCase().indexOf(filters.title.toLowerCase()) === -1) return false;
        if (filters.brandedVOD && !video.brandedVOD) return false;
        if (filters.unbrandedVOD && !video.unbrandedVOD) return false;
        if (filters.thirdPartyLinear && !video.thirdPartyLinear) return false;

        return true
    }

    const getTable = () => {
        return <>
            <div className='top-container'>
                <div>
                    <div className='filters-container'>
                        <TextInput labelText="Distributor" onChange={(e) => handleTextFilters(e, 'distributor')}/>
                        <TextInput labelText="Title" onChange={(e) => handleTextFilters(e, 'title')}/>
                    </div>
                    <div className='filters-container'>
                        <Checkbox label="Branded VOD" onChange={(value) => handleCheckboxFilters(value, 'brandedVOD')} checked={filters.brandedVOD}/>
                        <Checkbox label="Unbranded VOD" onChange={(value) => handleCheckboxFilters(value, 'unbrandedVOD')} checked={filters.unbrandedVOD}/>
                        <Checkbox label="3rd Party Linear" onChange={(value) => handleCheckboxFilters(value, 'thirdPartyLinear')} checked={filters.thirdPartyLinear}/>
                    </div>
                </div>
                <div className='buttons-container'>
                    <SelectInput options={outputMasters.map(master => {return { value: master.id, label: master.name}})} onChange={handleSelectMaster} />
                    <Button type='primary' text='Generate Template' onClick={() => handleGenerateTemplate()}/>
                </div>
            </div>

            <Table
                header={[
                    {colKey: 'distributor', colText: 'Distributor', width: 120},
                    {colKey: 'type', colText: 'Type', width: 80},
                    {colKey: 'title', colText: 'Title', width: 200},
                    {colKey: 'synopsis', colText: 'Synopsis', width: 400},
                    {colKey: 'shortSynopsis', colText: 'Short Synopsis', width: 400},
                    {colKey: 'duration', colText: 'Duration', width: 100},
                    {colKey: 'serie', colText: 'Serie', width: 100},
                    {colKey: 'season', colText: 'Season', width: 100},
                    {colKey: 'episode', colText: 'Episode', width: 100},
                    {colKey: 'countryOfOrigin', colText: 'Country Of Origin', width: 100},
                    {colKey: 'ratingValue', colText: 'Rating Value', width: 100},
                    {colKey: 'releaseDate', colText: 'Release Date', width: 100},
                    {colKey: 'mainCast', colText: 'Main Cast', width: 100},
                    {colKey: 'rightsTerritory', colText: 'Rights Territory', width: 100},
                    {colKey: 'genre', colText: 'Genre', width: 100},
                    {colKey: 'tags', colText: 'Tags', width: 100},
                    {colKey: 'adBreaks', colText: 'Ad Breaks', width: 100},
                    {colKey: 'rightsStart', colText: 'Rights Start', width: 100},
                    {colKey: 'rightsEnd', colText: 'Rights End', width: 100},
                    {colKey: 'brandedVOD', colText: 'Branded VOD', width: 50},
                    {colKey: 'unbrandedVOD', colText: 'Unbranded VOD', width: 50},
                    {colKey: 'thirdPartyLinear', colText: '3rd Party Linear', width: 50},
                    {colKey: 'fubo', colText: 'Fubo', width: 100},
                    {colKey: 'sling', colText: 'Sling', width: 100},
                    {colKey: 'xumo', colText: 'Xumo', width: 100},
                    {colKey: 'amazon', colText: 'Amazon', width: 100},
                    {colKey: 'pluto', colText: 'Pluto', width: 100},
                    {colKey: 'roku', colText: 'Roku', width: 100},
                    {colKey: 'vizio', colText: 'Vizio', width: 100},
                    {colKey: 'fsn', colText: 'FSN', width: 100},
                    {colKey: 'rsc', colText: 'RSC', width: 100},
                ]}
                rows={videos.filter(applyFilters).map(videoToRow)}
                showCheckboxes={true}
                selectRow={(o) => handleSelectVideos(o)}
            />
        </>

    }

    return (
    <div>
        <Typography type='title' className="mb-4">Generate Avails Template</Typography>

        {
            videos.length === 0 ? <CSVUpload addVideosFromCSVFile={handleUploadVideos}/> 
            :
            getTable()
        }
        
    </div>
    )
}

export default Page;