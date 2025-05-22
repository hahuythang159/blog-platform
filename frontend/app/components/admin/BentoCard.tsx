import { Paper, Typography } from "@mui/material";

const BentoCard = ({
    title,
    value,
    subtitle,
    gradient,
    onClick,
}: {
    title: string;
    value: string | number;
    subtitle?: string;
    gradient: string;
    onClick?: () => void;
}) => (
    <Paper
        elevation={3}
        onClick={onClick}
        sx={{
            p: 3,
            borderRadius: 3,
            background: gradient,
            color: "#fff",
            height: "100%",
            cursor: onClick ? "pointer" : "default",
            transition: "0.3s",
            "&:hover": onClick ? { boxShadow: 6, opacity: 0.95 } : {},
        }}
    >
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h4" fontWeight="bold" mt={1}>
            {value}
        </Typography>
        {subtitle && (
            <Typography variant="body2" mt={1} sx={{ opacity: 0.9 }}>
                {subtitle}
            </Typography>
        )}
    </Paper>
);

export default BentoCard;
