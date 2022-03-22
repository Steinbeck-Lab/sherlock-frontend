import './ResultCard.scss';

import Card from 'react-bootstrap/Card';
import { Molecule } from 'openchemlib/full';
import ResultCardText from './ResultCardText';
import {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import DataSet from '../../../../../types/sherlock/DataSet';
import { MolfileSvgRenderer } from 'react-ocl';
import { useHighlightData } from '../../../../highlight';

type InputProps = {
  id: string | number;
  dataSet: DataSet;
  imageWidth: number;
  imageHeight: number;
  styles?: CSSProperties;
};

function ResultCard({
  id,
  dataSet,
  imageWidth,
  imageHeight,
  styles = {},
}: InputProps) {
  const [atomHighlights, setAtomHighlights] = useState<number[]>([]);
  const highlightData = useHighlightData();

  useEffect(() => {
    if (dataSet.assignment) {
      const spectralMatchAssignment =
        dataSet.attachment.spectralMatchAssignment;
      const ids: number[] = [];
      dataSet.assignment.assignments[0].forEach(
        (signalArrayInPrediction, signalIndexInPrediction) => {
          const signalIndexInQuerySpectrum =
            spectralMatchAssignment.assignments[0].findIndex(
              (signalArrayQuery) =>
                signalArrayQuery.includes(signalIndexInPrediction),
            );
          if (
            signalIndexInQuerySpectrum >= 0 &&
            highlightData.highlight.highlighted.some(
              (highlightID) =>
                highlightID ===
                `correlation_signal_${signalIndexInQuerySpectrum}`,
            )
          )
            signalArrayInPrediction.forEach((atomIndex) => ids.push(atomIndex));
        },
      );

      setAtomHighlights(ids);
    }
  }, [
    dataSet.assignment,
    dataSet.attachment.spectralMatchAssignment,
    highlightData.highlight.highlighted,
  ]);

  const handleOnAtom = useCallback(
    (atomIndex, action: 'enter' | 'leave') => {
      if (dataSet.assignment) {
        const signalIndexInPrediction =
          dataSet.assignment.assignments[0].findIndex((signalArray) =>
            signalArray.includes(atomIndex),
          );
        if (signalIndexInPrediction >= 0) {
          const spectralMatchAssignment =
            dataSet.attachment.spectralMatchAssignment;
          const signalIndexInQuerySpectrum =
            spectralMatchAssignment.assignments[0].findIndex(
              (signalArrayQuery) =>
                signalArrayQuery.includes(signalIndexInPrediction),
            );
          if (signalIndexInQuerySpectrum >= 0) {
            const toHighlight = [
              `correlation_signal_${signalIndexInQuerySpectrum}`,
            ];

            highlightData.dispatch({
              type: action === 'enter' ? 'SHOW' : 'HIDE',
              payload: {
                convertedHighlights: toHighlight,
              },
            });

            const ids: number[] = [];
            // add possible equivalent atoms from same group
            const signalIndexInMolecule =
              dataSet.assignment.assignments[0].findIndex((signalArray) =>
                signalArray.includes(atomIndex),
              );
            if (signalIndexInMolecule >= 0) {
              dataSet.assignment.assignments[0][signalIndexInMolecule].forEach(
                (atomIndex) => {
                  ids.push(atomIndex);
                },
              );
            }
            setAtomHighlights(ids);
          }
        }
      }
    },
    [
      dataSet.assignment,
      dataSet.attachment.spectralMatchAssignment,
      highlightData,
    ],
  );

  const molfile = useMemo((): string => {
    const mol = Molecule.fromMolfile(dataSet.meta.molfile);
    mol.inventCoordinates();

    return mol.toMolfile();
  }, [dataSet.meta.molfile]);

  const cardBody = useMemo(
    () => (
      <Card.Body className="card-body">
        <div className="molfile-svg-renderer">
          <MolfileSvgRenderer
            id={`molSVG_${id}`}
            molfile={molfile}
            width={imageWidth}
            height={imageHeight}
            autoCrop={true}
            autoCropMargin={10}
            atomHighlight={atomHighlights}
            atomHighlightColor="orange"
            atomHighlightOpacity={0.65}
            onAtomEnter={(atomIndex) => handleOnAtom(atomIndex, 'enter')}
            onAtomLeave={(atomIndex) => handleOnAtom(atomIndex, 'leave')}
          />
        </div>
        <ResultCardText dataSet={dataSet} />
      </Card.Body>
    ),
    [
      atomHighlights,
      dataSet,
      handleOnAtom,
      id,
      imageHeight,
      imageWidth,
      molfile,
    ],
  );

  const cardLink = useMemo(
    () =>
      dataSet.meta.id ? (
        <Card.Link
          href={
            dataSet.meta.source === 'nmrshiftdb'
              ? `http://www.nmrshiftdb.org/molecule/${dataSet.meta.id}`
              : dataSet.meta.source === 'coconut'
              ? `https://coconut.naturalproducts.net/compound/coconut_id/${dataSet.meta.id}`
              : '?'
          }
          target="_blank"
          rel="noreferrer"
          title={`Link to molecule ${dataSet.meta.id} in ${
            dataSet.meta.source === 'nmrshiftdb'
              ? 'NMRShiftDB'
              : dataSet.meta.source === 'coconut'
              ? 'COCONUT'
              : '?'
          }`}
        >
          {dataSet.meta.id}
        </Card.Link>
      ) : null,
    [dataSet.meta.id, dataSet.meta.source],
  );

  return (
    <Card style={styles}>
      <Card.Header>{`#${id}`}</Card.Header>
      {cardBody}
      {cardLink}
    </Card>
  );
}

export default ResultCard;
