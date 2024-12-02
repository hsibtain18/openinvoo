import Box from "@mui/material/Box";
import "./App.css";
import ChartGroup from "./components/chartGroup";
import { LoaderProvider, useLoader } from "./LoaderCOntext";
import CircularProgress from "@mui/material/CircularProgress";

function App() {
  return (
    <LoaderProvider>
      <>
      <Loader/>
        <ChartGroup />
      </>
    </LoaderProvider>
  );
}

export default App;

const Loader: React.FC = () => {
  const { isLoading } = useLoader();

  if (!isLoading) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <CircularProgress />
    </Box>
  );
};
