import React, { useState } from 'react';
import * as XLSX from 'xlsx';

// or

// import XLSX from 'xlsx/dist/xlsx.core.min';

export function FileConversor() {
	const [data, setData] = useState(null);

	const [inputString, setInputString] = useState('');

	const handleInput = (e) => {
		setInputString(e.target.value);
	};

	const handleFile = (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();

		reader.onload = (event) => {
			const partyName = inputString;
			let csvData;

			if (file.name.endsWith('.xlsx')) {
				const data = new Uint8Array(event.target.result);
				const workbook = XLSX.read(data, { type: 'array' });
				const firstSheetName = workbook.SheetNames[0];
				console.log(workbook.SheetNames.length);
				const worksheet = workbook.Sheets[firstSheetName];
				console.log('WORKSHEET:', worksheet);
				csvData = XLSX.utils.sheet_to_csv(worksheet);
				console.log('DATA:', csvData === undefined);
			} else if (file.name.endsWith('.csv')) {
				csvData = event.target.result;
			} //the read file
			else {
				alert('Solo acepta .csv o .xlsx');
				setData(null);
				setInputString('');
				document.getElementById('file-input').value = '';
				return;
			}

			const lines = csvData.split('\n'); //array of lines
			let processedData = [];
			let entries = [];
			let rrpp = [];
			let separator = ',';

			if (lines[0].contains(';'))
				separator = ';';


			for (let i = 1; i < lines.length; i++) {
				// for (let i = 1; i < 2; i++) {
				// lines[i] = replaceString(',', ';', lines[i]);
				let parts = lines[i].split(separator);

				if (parts.length === 0 || parts[2].length < 4) continue;

				//remove 'fecha' column
				if (parts.length === 5) parts.splice(3, 1);

				let lastPos = parts.length - 1;

				//parts[lastPos] = parts[lastPos].replace('  - \n', '').replace('\n', '');

				parts[lastPos] = parts[lastPos].replace('  - \r', '');
				parts[lastPos] = parts[lastPos].replace('  - \n', '');
				parts[lastPos] = parts[lastPos].replace('\r', '');
				parts[lastPos] = parts[lastPos].replace('\n', '');
				let rp = parts[parts.length - 1];

				if (!rrpp.includes(rp)) {
					rrpp.push(rp);
					entries.push([]);
				}

				// entries[rrpp.indexOf(rp)].push(lines[i].replace(',', '.'));

				lines[i] = parts.join(',');
				// lines[i] = lines[i].replace(',', '.');
				entries[rrpp.indexOf(rp)].push(lines[i]);
			}

			processedData.push(
				'Name,Given Name,Additional Name,Family Name,Yomi Name,Given Name Yomi,Additional Name Yomi,Family Name Yomi,Name Prefix,Name Suffix,Initials,Nickname,Short Name,Maiden Name,Birthday,Gender,Location,Billing Information,Directory Server,Mileage,Occupation,Hobby,Sensitivity,Priority,Subject,Notes,Language,Photo,Group Membership,E-mail 1 - Type,E-mail 1 - Value,Phone 1 - Type,Phone 1 - Value'
			);

			for (let i = 0; i < rrpp.length; i++) {
				for (let line = 0; line < entries[i].length; line++) {
					let parts = entries[i][line].split(',');
					if (parts[2] === '') continue;
					if (parts[2].length > 1 && parts[2][0] !== '+') parts[2] = '+' + parts[2];

					processedData.push(
						parts[0] +
							',' +
							parts[0] +
							'/' +
							partyName +
							',,,,,,,,,,,,,,,,,,,,,,,,,,,* myContacts,,' +
							parts[1] +
							',' +
							parts[2] +
							',' +
							parts[2]
					);
				}
			}
			// processedData.push(lines[line].split(','));

			setData(processedData);
		};

		reader.readAsText(file);
	};

	const downloadData = () => {
		if (data === null || data.length === 1) {
			alert('Resultado vacio');
			return;
		}
		const fileData = data.join('\n');

		const blob = new Blob([fileData], { type: 'text/csv' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');

		a.href = url;
		a.download = inputString + '.csv';
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);

		restart();
	};

	const restart = () => {
		setData(null);
		document.getElementById('file-input').value = null;
		setInputString('');
		document.getElementById('party-input').value = '';
	};

	return (
		<div className='card'>
			<div className='container'>
				<h2>
					<u>Datos a Contacts</u>
				</h2>
				<div className='form-container'>
					<div className='party-name-container'>
						<label htmlFor='party-input'>Nombre del evento:</label>
						<input id='party-input' type='text' placeholder='Evento' onChange={handleInput} />
					</div>
					<div className='file-input-section'>
						<label htmlFor='file-input'>Elegir archivo:</label>
						<input
							disabled={inputString === ''}
							id='file-input'
							type='file'
							onChange={handleFile}
							className='file-input'
						/>
						<div className='download-section'>
							<button
								disabled={!data || inputString === ''}
								onClick={downloadData}
								className='download-button'
							>
								Descargar Contacts
							</button>
							<button className='remove-button' onClick={restart}>
								Reiniciar
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
