import { Typography, Card } from "@mui/material";
import React from "react";
import { Icon } from "@iconify/react";
import globe from "@iconify/icons-fluent/globe-48-regular";
import Image from "next/image";

export default function FeatureCard({ data }) {
  const image = `/icons/${data.image}.png`;
  return (
    <Card
      variant="outlined"
      sx={{
        maxWidth: 345,
        minHeight: 400,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        rowGap: "20px",
        justifyItems: "center",
        backgroundColor: "#FAFAFD"
      }}
    >
      <Image src={image} alt="hero image" width={50} height={50} />

      <Typography
        sx={{
          fontWeight: "500",
          fontSize: "20px",
          lineHeight: "24px",
          wordWrap: "break-word"
        }}
      >
        {data.title}
      </Typography>
      <Typography sx={{ textAlign: "center" }}>{data.description}</Typography>
    </Card>
  );
}
