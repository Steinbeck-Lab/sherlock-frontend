import './EditHybridizations.scss';

import { useCallback, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Button from '../../../../elements/Button';
import SelectBox from '../../../../elements/SelectBox';
import generateID from '../../../../../utils/generateID';

interface InputProps {
  hybridizations: number[];
  onDelete: Function;
  onAdd: Function;
}

const possibleHybridizations = ['sp1', 'sp2', 'sp3'];

function EditHybridizations({ hybridizations, onDelete, onAdd }: InputProps) {
  const [newHybridization, setNewHybridization] = useState<string>(
    possibleHybridizations[2],
  );

  const handleOnDelete = useCallback(
    (hybridization: number) => {
      onDelete(hybridization);
    },
    [onDelete],
  );

  const handleOnAdd = useCallback(() => {
    onAdd(Number(newHybridization.split('sp')[1]));
  }, [newHybridization, onAdd]);

  const rows = useMemo(() => {
    const _rows = hybridizations
      .map((hybridization) => {
        return (
          <tr key={`hybridization_${generateID()}`}>
            <td>{`sp${hybridization}`}</td>
            <td>
              <Button
                child={<FontAwesomeIcon icon={faTrashAlt} />}
                onClick={() => handleOnDelete(hybridization)}
              />
            </td>
          </tr>
        );
      })
      .flat();

    _rows.push(
      <tr key={`new_hybridization_${generateID()}`}>
        <td>
          <SelectBox
            defaultValue={newHybridization}
            onChange={(value: string) => setNewHybridization(value)}
            values={possibleHybridizations}
          />
        </td>
        <td>
          <Button
            child={<FontAwesomeIcon icon={faPlus} />}
            onClick={handleOnAdd}
          />
        </td>
      </tr>,
    );

    return _rows;
  }, [handleOnAdd, handleOnDelete, hybridizations, newHybridization]);

  const table = useMemo(() => {
    return (
      <table>
        <thead>
          <tr>
            <th>Hybridization</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }, [rows]);

  return <div className="edit-hybridizations">{table}</div>;
}

export default EditHybridizations;
