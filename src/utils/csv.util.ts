import * as csv from 'csv-parser';
import { Readable } from 'stream';
import { CsvProcessingResultDto, CsvValidationResultDto, ClientMeetingCsvDto } from './dto';

export function processCsvFromBuffer<T>(
  buffer: Buffer,
  validator: (row: any) => CsvValidationResultDto<T>
): Promise<CsvProcessingResultDto<T>> {
  return new Promise((resolve, reject) => {
    const results: T[] = [];
    const errors: string[] = [];
    let totalRows = 0;
    let validRows = 0;

    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    stream
      .pipe(csv())
      .on('data', (row) => {
        totalRows++;
        const validation = validator(row);
        
        if (validation.isValid && validation.data) {
          results.push(validation.data);
          validRows++;
        } else {
          errors.push(`Row ${totalRows}: ${validation.error || 'Invalid data'}`);
        }
      })
      .on('end', () => {
        const result = new CsvProcessingResultDto<T>();
        result.data = results;
        result.errors = errors;
        result.totalRows = totalRows;
        result.validRows = validRows;
        
        resolve(result);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

export function validateClientMeetingCsvRow(row: any): CsvValidationResultDto<ClientMeetingCsvDto> {
  const errors: string[] = [];

  const nombre = row['Nombre'] || row.Nombre;
  const correo = row['Correo Electronico'] || row['Correo Electrónico'] || row.correo;
  const telefono = row['Numero de Telefono'] || row['Número de Teléfono'] || row.telefono;
  const fecha = row['Fecha de la Reunion'] || row['Fecha de la Reunión'] || row.fecha;
  const vendedor = row['Vendedor asignado'] || row.vendedor;
  const cerrado = row['closed'] || row.closed;
  const transcripcion = row['Transcripcion'] || row['Transcripción'] || row.transcripcion;

  if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
    errors.push('Nombre is required');
  }

  if (!correo || typeof correo !== 'string' || !correo.includes('@')) {
    errors.push('Valid Correo Electronico is required');
  }

  if (!telefono || typeof telefono !== 'string' || !telefono.trim()) {
    errors.push('Numero de Telefono is required');
  }

  if (!vendedor || typeof vendedor !== 'string' || !vendedor.trim()) {
    errors.push('Vendedor asignado is required');
  }

  if (!fecha || typeof fecha !== 'string' || !fecha.trim()) {
    errors.push('Fecha de la Reunion is required');
  }

  if (cerrado !== undefined && 
      typeof cerrado !== 'boolean' && 
      cerrado !== 'true' && 
      cerrado !== 'false' && 
      cerrado !== 'TRUE' && 
      cerrado !== 'FALSE' &&
      cerrado !== '1' &&
      cerrado !== '0' &&
      cerrado !== 1 &&
      cerrado !== 0) {
    errors.push('closed must be a boolean, string representation, or numeric (1/0)');
  }

  if (errors.length > 0) {
    const result = new CsvValidationResultDto<ClientMeetingCsvDto>();
    result.isValid = false;
    result.error = errors.join(', ');
    return result;
  }

  const result = new CsvValidationResultDto<ClientMeetingCsvDto>();
  result.isValid = true;
  result.data = {
    name: nombre.trim(),
    email: correo.trim(),
    phone: telefono.trim(),
    salesmanName: vendedor.trim(),
    date: fecha.trim(),
    closed: cerrado === 'true' || cerrado === 'TRUE' || cerrado === true || cerrado === '1' || cerrado === 1,
    transcription: transcripcion?.trim() || ''
  };
  
  return result;
}
