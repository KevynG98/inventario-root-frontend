import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Modal, Spinner, Table } from 'react-bootstrap';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { ContextProvider, useMyContext } from './Context';
import HorizontalMenu from '../HorizontalMenu';
import NursingPatientForm from './Form';

const findMenuByKey = (items, key) => {
  if (!Array.isArray(items) || !key) {
    return null;
  }

  for (const item of items) {
    if (item?.key === key) {
      return item;
    }
    if (item?.children) {
      const nested = findMenuByKey(item.children, key);
      if (nested) {
        return nested;
      }
    }
  }

  return null;
};

const AdmissionsModal = () => {
  const {
    admissionsModalOpen,
    closeAdmissionsModal,
    admissions,
    admissionsLoading,
    admissionsError,
    handleAdmissionSelect,
    admissionsPage,
    admissionsNextPage,
    admissionsPrevPage,
    loadNextAdmissionsPage,
    loadPrevAdmissionsPage,
    selectedAdmissionId
  } = useMyContext();
  const groupedAdmissions = useMemo(() => {
    if (!Array.isArray(admissions) || admissions.length === 0) {
      return {};
    }

    return admissions.reduce((acc, admission) => {
      const area = (admission.area || 'SIN ÁREA').trim() || 'SIN ÁREA';
      if (!acc[area]) {
        acc[area] = [];
      }
      acc[area].push(admission);
      return acc;
    }, {});
  }, [admissions]);
  const [expandedAreas, setExpandedAreas] = useState({});

  useEffect(() => {
    setExpandedAreas((prev) => {
      const next = {};
      Object.keys(groupedAdmissions).forEach((area) => {
        next[area] = prev[area] ?? true;
      });
      return next;
    });
  }, [groupedAdmissions]);

  const areaEntries = useMemo(
    () =>
      Object.entries(groupedAdmissions).sort(([areaA], [areaB]) =>
        areaA.localeCompare(areaB, 'es', { sensitivity: 'base' })
      ),
    [groupedAdmissions]
  );

  const toggleArea = (area) => {
    setExpandedAreas((prev) => ({
      ...prev,
      [area]: !prev[area]
    }));
  };

  return (
    <Modal
      show={admissionsModalOpen}
      onHide={closeAdmissionsModal}
      size="xl"
      centered
      scrollable
    >
      <Modal.Header closeButton>
        <Modal.Title>Seleccionar admisión</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {admissionsError && !admissionsLoading && (
          <Alert variant="danger" className="mb-3">
            {admissionsError}
          </Alert>
        )}
        {admissionsLoading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" role="status" />
          </div>
        ) : admissions.length === 0 ? (
          <div className="text-center py-4">No hay admisiones disponibles.</div>
        ) : (
          areaEntries.map(([area, areaAdmissions]) => {
            const isExpanded = expandedAreas[area];
            return (
              <div key={area} className="mb-3 border rounded overflow-hidden shadow-sm">
                <button
                  type="button"
                  className="w-100 d-flex align-items-center justify-content-between px-3 py-2 border-0 bg-body-secondary text-dark fw-semibold text-uppercase"
                  onClick={() => toggleArea(area)}
                >
                  <span>{area}</span>
                  {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
                </button>
                {isExpanded && (
                  <div className="px-3 pb-3">
                    <div className="table-responsive">
                      <Table hover size="sm" className="align-middle mb-0 table-borderless">
                        <thead className="table-light">
                          <tr>
                            <th>Admisión</th>
                            <th>Fecha</th>
                            <th>Paciente</th>
                          </tr>
                        </thead>
                        <tbody>
                          {areaAdmissions.map((admission) => {
                            const admissionId =
                              admission.id_admision ?? admission.id ?? null;
                            const admissionIdValue =
                              admissionId !== null && admissionId !== undefined
                                ? String(admissionId)
                                : null;
                            const selectedIdValue =
                              selectedAdmissionId !== null &&
                              selectedAdmissionId !== undefined
                                ? String(selectedAdmissionId)
                                : null;
                            const isActive = admissionIdValue === selectedIdValue;

                            return (
                              <tr
                                key={
                                  admissionId ??
                                  `${area}-${admission.paciente}-${admission.fecha_admision}`
                                }
                                className={isActive ? 'table-active' : ''}
                                onClick={() => handleAdmissionSelect(admission)}
                                role="button"
                                style={{ cursor: 'pointer' }}
                              >
                                <td>
                                  <div className="fw-semibold">
                                    {admission.id_admision ?? '—'}
                                  </div>
                                  <div className="text-muted small">
                                    Número
                                  </div>
                                </td>
                                <td>
                                  <div className="fw-semibold">
                                    {admission.fecha_admision ?? '—'}
                                  </div>
                                  <div className="text-muted small">
                                    Fecha
                                  </div>
                                </td>
                                <td>
                                  <div className="fw-semibold">
                                    {admission.paciente ?? '—'}
                                  </div>
                                  <div className="text-muted small">
                                    Paciente
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <small className="text-muted mb-0">Página {admissionsPage}</small>
        <div className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            size="sm"
            disabled={!admissionsPrevPage || admissionsLoading}
            onClick={loadPrevAdmissionsPage}
          >
            Anterior
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={!admissionsNextPage || admissionsLoading}
            onClick={loadNextAdmissionsPage}
          >
            Siguiente
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

const NursingPage = () => {
  const {
    menuItems,
    activeMenuKey,
    iframeSrc,
    patient,
    handleMenuSelect,
    handlePatientFormSubmit,
    openAdmissionsModal
  } = useMyContext();
  const [showIframeModal, setShowIframeModal] = useState(false);
  const initialIframeLoadRef = React.useRef(true);

  useEffect(() => {
    if (!iframeSrc) {
      setShowIframeModal(false);
      return;
    }
    if (initialIframeLoadRef.current) {
      initialIframeLoadRef.current = false;
      return;
    }
    setShowIframeModal(true);
  }, [iframeSrc]);

  const activeMenuItem = useMemo(
    () => findMenuByKey(menuItems, activeMenuKey),
    [menuItems, activeMenuKey]
  );

  const iframeTitle = activeMenuItem?.label ?? 'Vista sin título';

  return (
    <>
      <AdmissionsModal />
      <div className="mb-3">
        <HorizontalMenu
          items={menuItems}
          activeKey={activeMenuKey}
          onSelect={handleMenuSelect}
        />
      </div>
      <NursingPatientForm
        patient={patient}
        onSave={handlePatientFormSubmit}
        onSelectAdmission={openAdmissionsModal}
      />
      <Modal
        show={Boolean(showIframeModal && iframeSrc)}
        onHide={() => setShowIframeModal(false)}
        centered
        size="xl"
        dialogClassName="enfermeria-modal-wide"
      >
        <Modal.Header closeButton>
          <Modal.Title>{iframeTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <iframe
            src={iframeSrc || 'about:blank'}
            title={`${iframeTitle} - modal`}
            style={{
              width: '100%',
              height: 'calc(90vh - 72px)',
              border: 'none'
            }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

const Index = () => (
  <ContextProvider>
    <NursingPage />
  </ContextProvider>
);

export default Index;
