import React from "react";
import { RedocStandalone } from "redoc";
import styles from "./ApiDocPage.module.css";

const ApiDocPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <RedocStandalone
        specUrl="http://localhost:8080/v3/api-docs"
        options={{
          theme: {
            colors: {
              primary: { main: "#f5c518" }, // Le jaune de ton site
            },
            typography: {
              fontFamily:
                'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              headings: {
                fontFamily:
                  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontWeight: "bold",
              },
            },
          },
        }}
      />
    </div>
  );
};

export default ApiDocPage;
