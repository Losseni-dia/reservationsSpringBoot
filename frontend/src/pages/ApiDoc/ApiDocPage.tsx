import React from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import styles from "./ApiDocPage.module.css";

const ApiDocPage: React.FC = () => {
  return (
    /* On ne met QUE le contenu de la page, car le Layout global s'occupe du reste */
    <div className={styles.swaggerSection}>
      <div className={styles.centeredContent}>
        <SwaggerUI
          url="/v3/api-docs/b2b-api"
          docExpansion="list"
        />
      </div>
    </div>
  );
};

export default ApiDocPage;
