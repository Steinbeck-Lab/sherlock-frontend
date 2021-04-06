import './QueryPanel.css';

/** @jsxImportSource @emotion/react */
import { useCallback, useState } from 'react';
import { DefaultTolerance, QueryTypes } from './constants';
import QueryOptionsTabs from './tabs/QueryOptionsTabs';
import { Formik, Form } from 'formik';

function QueryPanel({ onSubmit, isRequesting }) {
  const [queryType, setQueryType] = useState(QueryTypes.dereplication);

  const handleOnSelectTab = useCallback((_queryType) => {
    setQueryType(_queryType);
  }, []);

  return (
    <div className="query-panel">
      <Formik
        initialValues={{
          dereplicationOptions: {
            shiftTolerances: DefaultTolerance,
            checkMultiplicity: true,
            checkEquivalencesCount: true,
            useMF: true,
          },
          elucidationOptions: {
            allowHeteroHeteroBonds: false,
          },
          retrievalOptions: { resultID: '606849e41a589c0d33805527' },
        }}
        // validate={(values) => {
        //   const errors = {};
        //   return errors;
        // }}
        onSubmit={async (values, { setSubmitting }) => {
          await onSubmit(
            queryType,
            values.dereplicationOptions,
            values.elucidationOptions,
            values.retrievalOptions,
          );
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <QueryOptionsTabs onSelectTab={handleOnSelectTab} />
            <div className="submit-button-container">
              <button
                className="submit-button"
                type="submit"
                disabled={isSubmitting}
              >
                {queryType}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default QueryPanel;
