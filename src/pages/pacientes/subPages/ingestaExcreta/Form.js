import React, { useMemo } from 'react';
import { Badge, Button, Card, Form, Table } from 'react-bootstrap';
import { useIngestaExcretaContext } from './Context';

const numberFormatter = new Intl.NumberFormat('es-GT', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0
});

const formatNumber = (value) => numberFormatter.format(value ?? 0);

const formatDateTime = (iso) => {
  if (!iso) return 'Pendiente de guardar';
  try {
    return new Intl.DateTimeFormat('es-GT', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(iso));
  } catch {
    return 'Pendiente de guardar';
  }
};

const balanceClass = (value) => {
  if (value > 0) return 'text-success';
  if (value < 0) return 'text-danger';
  return 'text-muted';
};

const TOP_HEADER_STYLE = {
  backgroundColor: '#ffe5e5',
  color: '#a30000',
  fontWeight: 600,
  textTransform: 'uppercase'
};

const INPUT_STYLE = {
  height: '45px',
  width: '110px',
  fontSize: '16px',
  textAlign: 'center',
  margin: '2px auto',
  display: 'block'
};

const HEADER_INPUT_STYLE = {
  height: '42px',
  width: '120px',
  fontSize: '15px',
  textAlign: 'center',
  fontWeight: 500,
  margin: '0 auto',
  display: 'block'
};

const IngestaExcretaForm = () => {
  const {
    activeDate,
    activeTable,
    columns,
    helpers,
    actions: { updateColumnTitle, updateCellValue, saveTable }
  } = useIngestaExcretaContext();

  const ingestionColumns = columns.ingesta;
  const excretaColumns = columns.excreta;

  const summaries = useMemo(
    () => helpers.computeSummariesForTable(activeTable),
    [helpers, activeTable]
  );

  const shiftSummaryMap = useMemo(() => {
    if (!summaries) return new Map();
    return new Map(summaries.shiftSummaries.map((item) => [item.shiftId, item]));
  }, [summaries]);

  const handleHeaderChange = (columnId) => (event) => {
    updateColumnTitle(activeDate, columnId, event.target.value);
  };

  const handleCellChange = (slotId, columnId) => (event) => {
    updateCellValue(activeDate, slotId, columnId, event.target.value);
  };

  const handleSave = async () => {
    try {
      const result = await saveTable(activeDate);
      if (!result?.success) {
        window.alert('Ocurrió un problema al guardar el registro de ingesta y excreta.');
        return;
      }
      window.alert('Registros guardados correctamente.');
    } catch (error) {
      console.error('Error al guardar la tabla de ingesta/excreta', error);
      window.alert('No se pudo guardar el registro. Revisa la información e intenta nuevamente.');
    }
  };

  if (!activeDate || !activeTable) {
    return (
      <Card>
        <Card.Body>
          <Card.Title as="h5">Registro diario</Card.Title>
          <Card.Text className="text-muted">
            Selecciona o crea una fecha para comenzar a registrar la ingesta y excreta del paciente.
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }

  const renderShiftSummaryRow = (summary) => {
    if (!summary) return null;
    return (
      <tr className="table-secondary fw-semibold" key={`${summary.shiftId}-summary`}>
        <th scope="row" className="text-start">{summary.label}</th>
        {ingestionColumns.map((column) => (
          <td key={`${summary.shiftId}-ingesta-${column.id}`} className="text-end">
            {formatNumber(summary.columnTotals?.[column.id] ?? 0)}
          </td>
        ))}
        <td className="text-end">{formatNumber(summary.totalIngesta)}</td>
        {excretaColumns.map((column) => (
          <td key={`${summary.shiftId}-excreta-${column.id}`} className="text-end">
            {formatNumber(summary.columnTotals?.[column.id] ?? 0)}
          </td>
        ))}
        <td className="text-end">{formatNumber(summary.totalExcreta)}</td>
        <td className={`text-end ${balanceClass(summary.balance)}`}>
          {formatNumber(summary.balance)}
        </td>
      </tr>
    );
  };

  const dataRows = [];
  if (summaries?.rows?.length) {
    let currentShift = summaries.rows[0].shiftId;
    summaries.rows.forEach((row, index) => {
      if (currentShift && row.shiftId !== currentShift) {
        const summaryRow = shiftSummaryMap.get(currentShift);
        if (summaryRow) dataRows.push(renderShiftSummaryRow(summaryRow));
        currentShift = row.shiftId;
      }

      dataRows.push(
        <tr key={row.slotId}>
          <th scope="row" className="align-middle text-center">{row.label}</th>
          {ingestionColumns.map((column) => (
            <td key={`${row.slotId}-ingesta-${column.id}`}>
              <Form.Control
                type="number"
                inputMode="decimal"
                min="0"
                step="0.1"
                value={row.values[column.id] ?? ''}
                onChange={handleCellChange(row.slotId, column.id)}
                style={INPUT_STYLE}
              />
            </td>
          ))}
          <td className="text-end fw-semibold align-middle">
            {formatNumber(row.totals.ingestion)}
          </td>
          {excretaColumns.map((column) => (
            <td key={`${row.slotId}-excreta-${column.id}`}>
              <Form.Control
                type="number"
                inputMode="decimal"
                min="0"
                step="0.1"
                value={row.values[column.id] ?? ''}
                onChange={handleCellChange(row.slotId, column.id)}
                style={INPUT_STYLE}
              />
            </td>
          ))}
          <td className="text-end fw-semibold align-middle">
            {formatNumber(row.totals.excreta)}
          </td>
          <td className={`text-end fw-semibold align-middle ${balanceClass(row.totals.balance)}`}>
            {formatNumber(row.totals.balance)}
          </td>
        </tr>
      );

      const isLastRow = index === summaries.rows.length - 1;
      if (isLastRow && currentShift) {
        const summaryRow = shiftSummaryMap.get(currentShift);
        if (summaryRow) dataRows.push(renderShiftSummaryRow(summaryRow));
      }
    });
  }

  if (summaries?.totals24h) {
    dataRows.push(
      <tr className="table-warning fw-semibold" key="totals-24h">
        <th scope="row" className="text-start">Total 24 horas</th>
        {ingestionColumns.map((column) => (
          <td key={`totals-ingesta-${column.id}`} className="text-end">
            {formatNumber(summaries.totals24h.columnTotals?.[column.id] ?? 0)}
          </td>
        ))}
        <td className="text-end">{formatNumber(summaries.totals24h.totalIngesta)}</td>
        {excretaColumns.map((column) => (
          <td key={`totals-excreta-${column.id}`} className="text-end">
            {formatNumber(summaries.totals24h.columnTotals?.[column.id] ?? 0)}
          </td>
        ))}
        <td className="text-end">{formatNumber(summaries.totals24h.totalExcreta)}</td>
        <td className={`text-end ${balanceClass(summaries.totals24h.balance)}`}>
          {formatNumber(summaries.totals24h.balance)}
        </td>
      </tr>
    );
  }

  return (
    <Card>
      <Card.Header className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-2">
        <div>
          <Card.Title as="h5" className="mb-1">
            Registro del {helpers.formatDateFriendly(activeDate)}
          </Card.Title>
          <Card.Text className="text-muted mb-0">
            Completa los valores horarios para calcular los totales por turno y las 24 horas.
          </Card.Text>
          <Card.Text className="text-muted small mb-0">
            Último guardado: {formatDateTime(activeTable.lastSavedAt)}
          </Card.Text>
        </div>
        <div className="d-flex flex-wrap gap-2 align-items-center">
          {activeTable.dirty ? (
            <Badge bg="warning" text="dark">Cambios pendientes</Badge>
          ) : (
            <Badge bg="success">Último guardado</Badge>
          )}
          <Button onClick={handleSave}>Guardar registros</Button>
        </div>
      </Card.Header>

      <Card.Body className="p-0">
        {/* 🔹 contenedor con scroll horizontal SIEMPRE visible */}
        <div
          style={{
            overflowX: 'scroll',
            scrollbarGutter: 'stable', // mantiene el espacio del scroll
            whiteSpace: 'nowrap',
            paddingBottom: '8px'
          }}
        >
          <Table bordered size="sm" className="mb-0 align-middle">
            <thead>
              <tr>
                <th
                  className="text-center align-middle"
                  style={TOP_HEADER_STYLE}
                  rowSpan={2}
                >
                  Hora
                </th>
                <th
                  className="text-center align-middle"
                  style={TOP_HEADER_STYLE}
                  colSpan={ingestionColumns.length}
                >
                  Ingesta
                </th>
                <th
                  className="text-center align-middle"
                  style={TOP_HEADER_STYLE}
                  rowSpan={2}
                >
                  Total Ingesta
                </th>
                <th
                  className="text-center align-middle"
                  style={TOP_HEADER_STYLE}
                  colSpan={excretaColumns.length}
                >
                  Excreta
                </th>
                <th
                  className="text-center align-middle"
                  style={TOP_HEADER_STYLE}
                  rowSpan={2}
                >
                  Total Excreta
                </th>
                <th
                  className="text-center align-middle"
                  style={TOP_HEADER_STYLE}
                  rowSpan={2}
                >
                  Balance
                </th>
              </tr>
              <tr>
                {ingestionColumns.map((column) => (
                  <th key={`header-ingesta-${column.id}`}>
                    <Form.Control
                      type="text"
                      placeholder={column.defaultLabel}
                      value={activeTable.titleOverrides?.[column.id] ?? ''}
                      onChange={handleHeaderChange(column.id)}
                      style={HEADER_INPUT_STYLE}
                    />
                  </th>
                ))}
                {excretaColumns.map((column) => (
                  <th key={`header-excreta-${column.id}`}>
                    <Form.Control
                      type="text"
                      placeholder={column.defaultLabel}
                      value={activeTable.titleOverrides?.[column.id] ?? ''}
                      onChange={handleHeaderChange(column.id)}
                      style={HEADER_INPUT_STYLE}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{dataRows}</tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default IngestaExcretaForm;