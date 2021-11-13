import './ResultsInfo.scss';

import { useCallback } from 'react';
import { useData } from '../../../../context/DataContext';
import Button from '../../../elements/Button';
import { FaFileDownload, FaTrashAlt } from 'react-icons/fa';
import { Col, Container, Row } from 'react-bootstrap';

type InputProps = {
  onClickDownload: Function;
  onClickDelete: Function;
};

function ResultsInfo({ onClickDownload, onClickDelete }: InputProps) {
  const { resultData } = useData();

  const handleOnClickDownload = useCallback(() => {
    onClickDownload();
  }, [onClickDownload]);

  const handleOnClickDelete = useCallback(() => {
    onClickDelete(resultData?.resultRecord);
  }, [onClickDelete, resultData?.resultRecord]);

  return resultData ? (
    <div className="info-container">
      <Container className="info-grid">
        <Row>
          <Col className="key">Name:</Col>
          <Col className="value">{resultData.resultRecord?.name}</Col>
          <Col></Col>
        </Row>
        <Row>
          <Col className="key">Results:</Col>
          <Col className="value">
            {resultData.resultRecord?.dataSetListSize}
          </Col>
          <Col className="action-buttons">
            <Button
              child={<FaFileDownload title="Download" />}
              onClick={handleOnClickDownload}
              disabled={
                resultData.resultRecord?.dataSetList &&
                resultData.resultRecord.dataSetList.length > 0
                  ? false
                  : true
              }
            />
            <Button
              child={<FaTrashAlt title="Delete results" />}
              onClick={handleOnClickDelete}
              disabled={
                resultData.resultRecord?.dataSetList &&
                resultData.resultRecord.dataSetList.length > 0
                  ? false
                  : true
              }
            />
          </Col>
        </Row>
        {resultData.time && (
          <Row>
            <Col className="key">Time:</Col>
            <Col className="value">
              {(resultData.time / 60).toFixed(0)}
              {'min, '}
              {(resultData.time % 60).toFixed(0)}s
            </Col>
            <Col></Col>
          </Row>
        )}
      </Container>
    </div>
  ) : null;
}

export default ResultsInfo;
