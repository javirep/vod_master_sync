'use client';

//import Image from 'next/image';
import React, { useCallback } from 'react';
import Papa from 'papaparse';
import { useDropzone } from 'react-dropzone';
import uploadSvg from '../../assets/icons/upload.svg';
import * as XLSX from 'xlsx';
import { VideoModel } from '../../models/VideoModel';
import Typography from '../Typography/Typography';
import { MasterTrackerMaster } from '../../utils/masters/MasterTracker';

/* type CSVUploadProps = {
  addVideosFromCSVFile: (videos: VideoModel[]) => void;
}; */

const CSVUpload = (props) => {

  const { addVideosFromCSVFile } = props;

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return alert('Enter a valid file');

    if (
      file.type !== 'text/csv' &&
      file.type !==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
      return alert('Please upload a CSV or Excel file');

    if (
      file.type ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return handleExcelUpload(file);
    }

    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      if (!target) return;
      const csv = Papa.parse(target.result, {
        header: true,
      });
      const parsedData = csv?.data;
      extractRecipients(parsedData);
    };
    reader.readAsText(file);
  }, []);

  const handleExcelUpload = useCallback((file) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target) {
        const workbook = XLSX.read(event.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const sheetData = XLSX.utils.sheet_to_json(sheet);

        extractRecipients(sheetData);
      }
    };

    reader.readAsArrayBuffer(file);
  }, []);

  const extractRecipients = useCallback((data) => {
    const truthyValues = ['true', 'yes', '1', 'y', 'TRUE', 'YES', 'Y'];
    const falsyValues = ['false', 'no', '0', 'n', 'FALSE', 'NO', 'N'];


    const recipients = data.map((data, index) => {

      const video = {};

      Object.keys(MasterTrackerMaster).forEach((key) => {
        let value = data[MasterTrackerMaster[key].key];


        if (truthyValues.includes(value)) video[key] = true;
        else if (falsyValues.includes(value)) video[key] = false;
        else video[key] = data[MasterTrackerMaster[key].key];
      });

      return video
    });

    // Filter out recipients with all missing fields
    const filteredRecipients = recipients.filter(
      (recipient) => Object.values(recipient).filter(Boolean).length > 1
    );

    addVideosFromCSVFile(filteredRecipients);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="flex flex-col md:flex-row justify-between gap-2 rounded-3xl bg-seaFoam-300 p-4 ">
      <div
        {...getRootProps()}
        className="cursor-pointer p-4 flex-1 border border-seaFoam-700 border-dashed rounded-3xl flex flex-col justify-center items-center"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <>
            <img width={32} height={32} src={uploadSvg} alt="upload" />
            <Typography
              type="body"
              className="mt-2"
            > Drag and drop an Excel or CSV file or click to browse
            </Typography>
          </>
        )}
      </div>
    </div>
  );
};

export default CSVUpload;
