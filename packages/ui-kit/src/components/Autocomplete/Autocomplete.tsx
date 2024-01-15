import { Button } from '@mui/base/Button'
import { Popper } from '@mui/base/Popper'
import { Input } from '@mui/base/Input'
import { useAutocomplete } from '@mui/base/useAutocomplete'
import * as React from 'react'
import classnames from 'classnames'
import componentStyles from './Autocomplete.module.scss'
import { useCombinedRefs } from '../../helpers'
import { AutocompleteProps } from './Autocomplete.types'
import { ChevronUpIcon } from '../Icons/ChevronUp'
import { ChevronDownIcon } from '../Icons/ChevronDown'

// See full Autocomplete example here: https://mui.com/base-ui/react-autocomplete/#introduction
export const Autocomplete = React.forwardRef(function Autocomplete(
  props: AutocompleteProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const { disabled = false, readOnly = false, placeholder = '', ...other } = props

  const {
    getRootProps,
    getInputProps,
    getPopupIndicatorProps,
    getListboxProps,
    getOptionProps,
    id,
    popupOpen,
    focused,
    anchorEl,
    setAnchorEl,
    groupedOptions
  } = useAutocomplete({
    ...props,
    componentName: 'Autocomplete'
  })

  const rootRef = useCombinedRefs(ref, setAnchorEl)

  return (
    <React.Fragment>
      <div
        {...getRootProps(other)}
        ref={rootRef}
        className={classnames(componentStyles.rootAutocomplete, focused && componentStyles.rootAutocomplete__focused)}
      >
        <Input
          id={id}
          ref={setAnchorEl}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          slotProps={{
            input: {
              className: componentStyles.autocompleteInput,
              ...getInputProps()
            }
          }}
          style={{ width: '100%' }}
        />
        <Button
          {...getPopupIndicatorProps()}
          aria-label="dropdown-button"
          className={componentStyles.autocompleteIndicator}
        >
          {popupOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Button>
      </div>
      {anchorEl ? (
        <Popper
          open={popupOpen}
          anchorEl={anchorEl}
          placement="bottom-start"
          slots={{
            root: 'div'
          }}
          modifiers={[
            { name: 'flip', enabled: false },
            { name: 'preventOverflow', enabled: false }
          ]}
          disablePortal
        >
          <ul {...getListboxProps()} className={componentStyles.autocompleteList}>
            {groupedOptions.map((option, index) => {
              if ('label' in option) {
                const optionProps = getOptionProps({ option, index })

                return (
                  <li key={index} {...optionProps}>
                    {option.label}
                  </li>
                )
              }
            })}
            {groupedOptions.length === 0 && <li>No results</li>}
          </ul>
        </Popper>
      ) : null}
    </React.Fragment>
  )
})
