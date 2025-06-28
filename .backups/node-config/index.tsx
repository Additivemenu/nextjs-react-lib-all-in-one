import React, { PropsWithChildren } from "react";

import {
  type FieldValues,
  FormProvider,
  type UseFormReturn,
} from "react-hook-form";

import { ComboBox } from "./combobox";
import { ConfigDialog } from "./config-dialog";
import { ErrorMessage } from "./error";
import { Group } from "./group";
import { InputText } from "./input-text";
import { MenuTrigger } from "./menu-item";
import { Select } from "./option-select";
import { Slider } from "./slider";
import { Submit } from "./submit";
import { TextArea } from "./text-area";
import { Title } from "./title";
import { Toggle } from "./toggle";

interface NodeConfigProps<TFieldValues extends FieldValues>
  extends PropsWithChildren {
  onSubmit?: (data: TFieldValues) => void;
  methods: UseFormReturn<TFieldValues>;
}

const NodeConfig = <T extends FieldValues>({
  children,
  onSubmit,
  methods,
  ...rest
}: NodeConfigProps<T>) => {
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit((data) => {
          onSubmit?.(data);
        })}
        className="h-full overflow-y-auto"
        {...rest}
      >
        {children}
      </form>
    </FormProvider>
  );
};

NodeConfig.Title = Title;
NodeConfig.Select = Select;
NodeConfig.Submit = Submit;
NodeConfig.InputText = InputText;
NodeConfig.Group = Group;
NodeConfig.ComboBox = ComboBox;
NodeConfig.Toggle = Toggle;
NodeConfig.Slider = Slider;
NodeConfig.ErrorMessage = ErrorMessage;
NodeConfig.MenuItem = MenuTrigger;
NodeConfig.ConfigDialog = ConfigDialog;
NodeConfig.TextArea = TextArea;

export default NodeConfig;
export * from "./types";
