import { Box, Typography } from "@mui/material";
import React from "react";
import FeatureCard from "./FeatureCard";
import { useTheme } from "@glom/theme";
import { featuresData } from "../../data";
import { useIntl } from "react-intl";

export default function FeatureSection() {
  const theme = useTheme();

  const { formatMessage } = useIntl();

  return (
    <Box
      sx={{
        background: "url('feature_bg.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "100% 70%",
        backgroundSize: "100% 20%",
        paddingTop: "54px",
        paddingBottom: "16px"
      }}
    >
      <Typography
        className="title-landing-page"
        textAlign="center"
        sx={{
          color: {
            desktop: theme.common.titleActive,
            mobile: "black"
          }
        }}
      >
        {formatMessage({ id: "featureHeadline" })}
      </Typography>
      <Typography
        className="p1--space"
        textAlign="center"
        sx={{ mt: "10px", paddingX: "5px" }}
      >
        {formatMessage({ id: "featureSubtitle" })}
      </Typography>

      <Box
        sx={{
          rowGap: "16px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit , minmax(300px, 1fr))",
          marginTop: "48px",
          justifyContent: "space-around",
          // flexWrap: "wrap",
          maxWidth: "80%",
          marginX: "auto"
        }}
      >
        {featuresData.map((item, key) => (
          <FeatureCard data={item} key={key} />
        ))}
      </Box>
    </Box>
  );
}
