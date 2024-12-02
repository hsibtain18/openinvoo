import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { filterSeriesByName } from "../service/fredService";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

const ChartConfigure = ({ onUpdate, chartToEdit, onResetEditing }) => {
  const [seriesId, setSeriesId] = useState<string | null>();
  const [inputValue, setInputValue] = useState("");
  const [title, setTitle] = useState("");
  const [axisName, setAxisName] = useState("");
  const [color, setColors] = useState("");
  const [options, setOptions] = useState([]);
  const [chartType, setChartType] = useState("bar");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [dropdown, setDropdown] = useState(false);
  const [observationStart, setObservationStart] = useState<Dayjs | null>(null);
  const [observationEnd, setObservationEnd] = useState<Dayjs | null>(null);
  const [editMode, setEditMode] = useState(false);

  const handleClose = (    // for closing out error
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    if (chartToEdit?.data) { // Populating state after edit button is clicked 
      if (!editMode) {
        setSeriesId(chartToEdit.data.config?.seriesId || "");
        setTitle(chartToEdit.data.config?.title || "");
        setAxisName(chartToEdit.data.config?.axisName || "");
        setColors(chartToEdit.data.config?.color || "");
        setChartType(chartToEdit.data.config?.chartType || "");
        setObservationStart(
          chartToEdit.data.config?.start
            ? dayjs(chartToEdit.data.config.start)
            : null
        );
        setObservationEnd(
          chartToEdit.data.config?.end
            ? dayjs(chartToEdit.data.config.end)
            : null
        );
        setEditMode(true);  // Disable re-run of code as chartToEdit is added in dependency ArrayList
      }
      return;
    }
    chartToEdit = {};
    if (!inputValue) {
      setOptions([]);
      return;
    }
    if (dropdown) {
      return;   // Stopping reSearching after an option is clicked from dropdown  
    }
    const filterSearchSeries = async () => {
      try {
        const res = await filterSeriesByName(inputValue); // Get Searching value as user type
        if (res?.seriess) {
          const temp = res.seriess.map((item) => ({
            id: item.id,
            label: item.title,
          }));
          setOptions(temp);
        }
      } catch (error) {
        ShowError(String(error))
        setOptions([]);
      }
    };
    const timeoutId = setTimeout(filterSearchSeries, 100); // Add debounce of .1 sec
    return () => clearTimeout(timeoutId);
  }, [chartToEdit, inputValue]);

  const handleUpdate = () => {
    if (title && seriesId && chartType) {
      if (chartToEdit) {
        setEditMode(false); // Resetting after update
        onResetEditing();
      }
      if (observationEnd && !observationStart) {
        ShowError("Please Enter Dates");
        return;
      }
      if (dayjs(observationStart).isAfter(dayjs(observationEnd))) {
        ShowError("Please Enter Valid Dates");
        return;
      }
      if (color && color.length != 3 && color.length != 6) {
        ShowError("Please Enter Valid Color value");
        return;
      }
      const start = observationStart
        ? dayjs(observationStart).format("YYYY-MM-DD")
        : "";
      const end = observationEnd
        ? dayjs(observationEnd).format("YYYY-MM-DD")
        : "";

      onUpdate({ seriesId, title, chartType, axisName, start, end, color });
      setSeriesId("");
      setInputValue("");
      setTitle("");
      setAxisName("");
      setColors("");
      setOptions([]);
      setChartType("");
      setObservationStart(null);
      setObservationEnd(null);
    } else {
      ShowError("Please Enter All Details");
    }
  };
  const loadObservation = (value) => {
    setDropdown(true);
  };

  const ShowError = (message: string) => {
    setMessage(message);
    setOpen(true);
  };
  return (
    <div>
      <h2>Configure Chart</h2>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          <Grid size={12}> 
            <Autocomplete
              value={seriesId}
              onChange={(event: any, newValue: string | null) => {
                setSeriesId(newValue);
                loadObservation(newValue);
              }}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => {
                if (dropdown) {
                  setDropdown(false);
                }
                setInputValue(newInputValue);
              }}
              id="search"
              options={options}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Series"
                  placeholder="Type for search"
                />
              )}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              sx={{ width: "100%" }}
              id="Chart_Name"
              label="Chart Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              sx={{ width: "100%" }}
              id="axisName"
              label="Axis Name"
              value={axisName}
              onChange={(e) => setAxisName(e.target.value)}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              sx={{ width: "100%" }}
              id="axisName"
              label="Color (Hex Value)"
              value={color}
              inputProps={{
                maxLength: 6,
              }}
              onChange={(e) => setColors(e.target.value)}
              error={!!(color && color.length !== 3 && color.length !== 6)}
            />
          </Grid>
          <Grid size={6}>
            <FormControl fullWidth>
              <InputLabel id="Type">Type</InputLabel>
              <Select
                labelId="Type"
                id="Type"
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                label="Type"
              >
                <MenuItem disabled value="">
                  Select
                </MenuItem>
                <MenuItem value="line">Line</MenuItem>
                <MenuItem value="bar">Bar</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Start Date"
                  value={observationStart}
                  sx={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  onChange={(value) => setObservationStart(value)}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Grid>
          <Grid size={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="End Date"
                  value={observationEnd}
                  sx={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  onChange={(value) => setObservationEnd(value)}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Grid>
          <Grid size={12}>
            <Button variant="outlined" onClick={handleUpdate}>
              {chartToEdit ? 'Edit':'Create'}
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message={message}
      />
    </div>
  );
};

export default ChartConfigure;
