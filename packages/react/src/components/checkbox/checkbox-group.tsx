import { createContext } from "@/provider/create-context";
import { Flex, type FlexProps } from "@/rsc";
import { cx } from "@dreamy-ui/system/css";
import type { CheckboxVariantProps } from "@dreamy-ui/system/recipes";
import { useMemo } from "react";
import {
    type UseCheckboxGroupProps,
    type UseCheckboxGroupReturn,
    useCheckboxGroup
} from "./use-checkbox-group";

export interface CheckboxGroupContext
    extends Pick<
            UseCheckboxGroupReturn,
            "onChange" | "value" | "isDisabled" | "isInvalid" | "isRequired" | "isReadOnly"
        >,
        CheckboxVariantProps {
    /**
     * Should reduce motion
     */
    reduceMotion?: boolean;
}

export const [CheckboxGroupProvider, useCheckboxGroupContext] = createContext<CheckboxGroupContext>(
    {
        name: "CheckboxGroupContext",
        strict: false
    }
);

export interface CheckboxGroupProps
    extends UseCheckboxGroupProps,
        CheckboxVariantProps,
        Omit<FlexProps, "defaultValue" | "onChange"> {}

/**
 * CheckboxGroup component. Useful for grouping multiple checkboxes together.
 *
 * @See Docs https://dream-ui.com/docs/components/checkbox-group
 */
export function CheckboxGroup(props: CheckboxGroupProps) {
    const {
        scheme,
        size,
        variant,
        children,
        isDisabled,
        isRequired,
        isReadOnly,
        isInvalid,
        reduceMotion,
        onChange: onChangeProp,
        defaultValue,
        ...rest
    } = props;
    const { value, onChange } = useCheckboxGroup({
        onChange: onChangeProp,
        defaultValue,
        ...props
    });

    const group = useMemo(
        () => ({
            size,
            scheme,
            variant,
            value,
            onChange,
            isDisabled,
            isRequired,
            isReadOnly,
            isInvalid,
            reduceMotion
        }),
        [
            size,
            onChange,
            scheme,
            value,
            variant,
            isDisabled,
            isRequired,
            isReadOnly,
            isInvalid,
            reduceMotion
        ]
    );

    return (
        <CheckboxGroupProvider value={group}>
            <Flex
                {...rest}
                className={cx("dream-checkbox-group", rest.className)}
            >
                {children}
            </Flex>
        </CheckboxGroupProvider>
    );
}

CheckboxGroup.displayName = "CheckboxGroup";
