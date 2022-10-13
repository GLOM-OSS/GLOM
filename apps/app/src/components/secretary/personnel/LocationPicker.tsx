/* eslint-disable @typescript-eslint/no-explicit-any */
import { LocationOnRounded } from '@mui/icons-material';
import { Autocomplete, Grid, TextField, Typography } from '@mui/material';
import throttle from 'lodash/throttle';
import { useEffect, useMemo, useRef, useState } from 'react';
import parse from 'autosuggest-highlight/parse';

function loadScript(src: string, position: HTMLElement | null, id: string) {
  if (!position) {
    return;
  }

  const script = document.createElement('script');
  script.setAttribute('async', '');
  script.setAttribute('id', id);
  script.src = src;
  position.appendChild(script);
}

const autocompleteService = { current: null };

interface MainTextMatchedSubstrings {
  offset: number;
  length: number;
}
interface StructuredFormatting {
  main_text: string;
  secondary_text: string;
  main_text_matched_substrings: readonly MainTextMatchedSubstrings[];
}
interface PlaceType {
  description: string;
  structured_formatting: StructuredFormatting;
}

export default function LocationPicker({
  handleChange,
  required,
  label,
  handleBlur,
  error,
  helperText,
  disabled,
  initialValue,
}: {
  handleBlur: () => void;
  label: string;
  disabled: boolean;
  error: boolean;
  helperText: string | undefined;
  required: boolean;
  initialValue: PlaceType;
  handleChange: (location: PlaceType | null) => void;
}) {
  const [value, setValue] = useState<PlaceType | null>(initialValue);
  const [inputValue, setInputValue] = useState<string>('');
  const [options, setOptions] = useState<readonly PlaceType[]>([]);
  const loaded = useRef(false);

  if (typeof window !== 'undefined' && !loaded.current) {
    if (!document.querySelector('#google-maps')) {
      loadScript(
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyDYFQ9bbgFmqBdn_llTxm4gfooXajGYOuE&libraries=places',
        document.querySelector('head'),
        'google-maps'
      );
    }

    loaded.current = true;
  }

  const fetch = useMemo(
    () =>
      throttle(
        (
          request: { input: string },
          callback: (results?: readonly PlaceType[]) => void
        ) => {
          (autocompleteService.current as any).getPlacePredictions(
            request,
            callback
          );
        },
        200
      ),
    []
  );

  useEffect(() => {
    let active = true;

    if (!autocompleteService.current && (window as any).google) {
      autocompleteService.current = new (
        window as any
      ).google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions: readonly PlaceType[] = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <Autocomplete
      // defaultValue={initialValue}
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option.description
      }
      filterOptions={(x) => x}
      options={options}
      autoComplete
      fullWidth
      includeInputInList
      filterSelectedOptions
      value={value}
      onChange={(event, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
        handleChange(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          onBlur={handleBlur}
          error={error}
          helperText={helperText}
          label={label}
          required={required}
        />
      )}
      renderOption={(props, option) => {
        const matches =
          option.structured_formatting.main_text_matched_substrings;
        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match: any) => [
            match.offset,
            match.offset + match.length,
          ])
        );

        return (
          <li {...props}>
            <Grid container alignItems="center">
              <Grid item>
                <LocationOnRounded sx={{ color: 'text.secondary', mr: 2 }} />
              </Grid>
              <Grid item>
                {parts.map((part, index) => (
                  <span
                    key={index}
                    style={{ fontWeight: part.highlight ? 700 : 400 }}
                  >
                    {part.text}
                  </span>
                ))}

                <Typography variant="body2" color="text.secondary">
                  {option.structured_formatting.secondary_text}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
}
