import { type UseClickableProps, useClickable } from "@/components/clickable";
import { useControllableState } from "@/hooks/use-controllable-state";
import { mergeRefs } from "@/hooks/use-merge-refs";
import { createContext } from "@/provider/create-context";
import { callAllHandlers } from "@/utils";
import { getValidChildren } from "@/utils/children";
import { type LazyMode, lazyControl } from "@/utils/lazy";
import { createElement, useCallback, useEffect, useId, useRef, useState } from "react";
import { createDescendantContext } from "../descendant";

/* -------------------------------------------------------------------------------------------------
 * Create context to track descendants and their indices
 * -----------------------------------------------------------------------------------------------*/

export const [
    TabsDescendantsProvider,
    useTabsDescendantsContext,
    useTabsDescendants,
    useTabsDescendant
] = createDescendantContext<HTMLButtonElement>();

/* -------------------------------------------------------------------------------------------------
 * useTabs - The root react hook that manages all tab items
 * -----------------------------------------------------------------------------------------------*/

export interface UseTabsProps {
    /**
     * The orientation of the tab list.
     * @default "horizontal"
     */
    orientation?: "vertical" | "horizontal";
    /**
     * If `true`, the tabs will be manually activated and
     * display its panel by pressing Space or Enter.
     *
     * If `false`, the tabs will be automatically activated
     * and their panel is displayed when they receive focus.
     *
     * @default false
     */
    isManual?: boolean;
    /**
     * Callback when the index (controlled or un-controlled) changes.
     */
    onChange?: (index: number) => void;
    /**
     * The index of the selected tab (in controlled mode)
     */
    index?: number;
    /**
     * The initial index of the selected tab (in uncontrolled mode)
     */
    defaultIndex?: number;
    /**
     * The id of the tab
     */
    id?: string;
    /**
     * Performance 🚀:
     * If `true`, rendering of the tab panel's will be deferred until it is selected.
     * @default false
     */
    isLazy?: boolean;
    /**
     * Performance 🚀:
     * The lazy behavior of tab panels' content when not active.
     * Only works when `isLazy={true}`
     *
     * - "unmount": The content of inactive tab panels are always unmounted.
     * - "keepMounted": The content of inactive tab panels is initially unmounted,
     * but stays mounted when selected.
     *
     * @default "unmount"
     */
    lazyBehavior?: LazyMode;
    /**
     * The writing mode direction.
     *
     * - When in RTL, the left and right navigation is flipped
     * @default "ltr"
     */
    direction?: "rtl" | "ltr";
}

export function useTabs(props: UseTabsProps) {
    const {
        defaultIndex,
        onChange,
        index,
        isManual,
        isLazy,
        lazyBehavior = "unmount",
        orientation = "horizontal",
        direction = "ltr",
        ...htmlProps
    } = props;

    /**
     * We use this to keep track of the index of the focused tab.
     *
     * Tabs can be automatically activated, this means selection follows focus.
     * When we navigate with the arrow keys, we move focus and selection to next/prev tab
     *
     * Tabs can also be manually activated, this means selection does not follow focus.
     * When we navigate with the arrow keys, we only move focus NOT selection. The user
     * will need not manually activate the tab using `Enter` or `Space`.
     *
     * This is why we need to keep track of the `focusedIndex` and `selectedIndex`
     */
    const [focusedIndex, setFocusedIndex] = useState(defaultIndex ?? 0);

    const [selectedIndex, setSelectedIndex] = useControllableState({
        defaultValue: defaultIndex ?? 0,
        value: index,
        onChange
    });

    /**
     * Sync focused `index` with controlled `selectedIndex` (which is the `props.index`)
     */
    useEffect(() => {
        if (index != null) {
            setFocusedIndex(index);
        }
    }, [index]);

    /**
     * Think of `useDescendants` as a register for the tab nodes.
     */
    const descendants = useTabsDescendants();

    /**
     * Generate a unique id or use user-provided id for the tabs widget
     */
    const uuid = useId();
    const uid = props.id ?? uuid;
    const id = `tabs-${uid}`;

    return {
        id,
        selectedIndex,
        focusedIndex,
        setSelectedIndex,
        setFocusedIndex,
        isManual,
        isLazy,
        lazyBehavior,
        orientation,
        descendants,
        direction,
        htmlProps
    };
}

export type UseTabsReturn = Omit<ReturnType<typeof useTabs>, "htmlProps" | "descendants">;

export const [TabsProvider, useTabsContext] = createContext<UseTabsReturn>({
    name: "TabsContext",
    errorMessage:
        "useTabsContext: `context` is undefined. Seems you forgot to wrap all tabs components within <Tabs />"
});

export interface UseTabListProps {
    children?: React.ReactNode;
    onKeyDown?: React.KeyboardEventHandler;
    ref?: React.Ref<any>;
}

/**
 * Tabs hook to manage multiple tab buttons,
 * and ensures only one tab is selected per time.
 *
 * @param props props object for the tablist
 */
export function useTabList<P extends UseTabListProps>(props: P) {
    const { focusedIndex, orientation, direction } = useTabsContext();

    const descendants = useTabsDescendantsContext();

    const onKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
            const nextTab = () => {
                const next = descendants.nextEnabled(focusedIndex);
                if (next) next.node?.focus();
            };
            const prevTab = () => {
                const prev = descendants.prevEnabled(focusedIndex);
                if (prev) prev.node?.focus();
            };
            const firstTab = () => {
                const first = descendants.firstEnabled();
                if (first) first.node?.focus();
            };
            const lastTab = () => {
                const last = descendants.lastEnabled();
                if (last) last.node?.focus();
            };

            const isHorizontal = orientation === "horizontal";
            const isVertical = orientation === "vertical";

            const eventKey = event.key;

            const ArrowStart = direction === "ltr" ? "ArrowLeft" : "ArrowRight";
            const ArrowEnd = direction === "ltr" ? "ArrowRight" : "ArrowLeft";

            const keyMap: Record<string, React.KeyboardEventHandler> = {
                [ArrowStart]: () => isHorizontal && prevTab(),
                [ArrowEnd]: () => isHorizontal && nextTab(),
                ArrowDown: () => isVertical && nextTab(),
                ArrowUp: () => isVertical && prevTab(),
                Home: firstTab,
                End: lastTab
            };

            const action = keyMap[eventKey];

            if (action) {
                event.preventDefault();
                action(event);
            }
        },
        [descendants, focusedIndex, orientation, direction]
    );

    return {
        ...props,
        role: "tablist",
        "aria-orientation": orientation,
        onKeyDown: callAllHandlers(props.onKeyDown, onKeyDown)
    };
}

export type UseTabListReturn = ReturnType<typeof useTabList>;

export interface UseTabOptions {
    /**
     * If `true` and `isDisabled`, the `Tab` will be focusable but not interactive.
     * @default false
     */
    isFocusable?: boolean;
}

export interface UseTabProps
    extends Omit<UseClickableProps, "color" | "translate" | "content">,
        UseTabOptions {}

/**
 * Tabs hook to manage each tab button.
 *
 * A tab can be disabled and focusable, or both,
 * hence the use of `useClickable` to handle this scenario
 */
export function useTab<P extends UseTabProps>(props: P) {
    const { isDisabled = false, isFocusable = false, ...htmlProps } = props;

    const { setSelectedIndex, isManual, id, setFocusedIndex, selectedIndex } = useTabsContext();

    const { index, register } = useTabsDescendant({
        disabled: isDisabled && !isFocusable
    });

    const isSelected = index === selectedIndex;

    const onClick = useCallback(() => {
        setSelectedIndex(index);
    }, [index, setSelectedIndex]);

    const onFocus = useCallback(() => {
        setFocusedIndex(index);
        const isDisabledButFocusable = isDisabled && isFocusable;
        const shouldSelect = !isManual && !isDisabledButFocusable;
        if (shouldSelect) {
            setSelectedIndex(index);
        }
    }, [index, isDisabled, isFocusable, isManual, setSelectedIndex, setFocusedIndex]);

    const clickableProps = useClickable({
        ...htmlProps,
        ref: mergeRefs(register, props.ref),
        isDisabled,
        isFocusable,
        onClick: callAllHandlers(props.onClick, onClick)
    });

    const type: "button" | "submit" | "reset" = "button";

    return {
        isSelected,
        props: {
            ...clickableProps,
            id: makeTabId(id, index),
            role: "tab",
            tabIndex: isSelected ? 0 : -1,
            type,
            "aria-selected": isSelected,
            "aria-controls": makeTabPanelId(id, index),
            onFocus: isDisabled ? undefined : callAllHandlers(props.onFocus, onFocus)
        }
    };
}

export interface UseTabPanelsProps {
    children?: React.ReactNode;
}

const [TabPanelProvider, useTabPanelContext] = createContext<{
    isSelected: boolean;
    id: string;
    tabId: string;
    selectedIndex: number;
}>({});

/**
 * Tabs hook for managing the visibility of multiple tab panels.
 *
 * Since only one panel can be show at a time, we use `cloneElement`
 * to inject `selected` panel to each TabPanel.
 *
 * It returns a cloned version of its children with
 * all functionality included.
 */
export function useTabPanels<P extends UseTabPanelsProps>(props: P) {
    const context = useTabsContext();

    const { id, selectedIndex } = context;

    const validChildren = getValidChildren(props.children);

    const children = validChildren.map((child, index) =>
        createElement(
            TabPanelProvider,
            {
                key: index,
                value: {
                    isSelected: index === selectedIndex,
                    id: makeTabPanelId(id, index),
                    tabId: makeTabId(id, index),
                    selectedIndex
                }
            },
            child
        )
    );

    return { ...props, children };
}

/**
 * Tabs hook for managing the visible/hidden states
 * of the tab panel.
 *
 * @param props props object for the tab panel
 */
export function useTabPanel(props: Record<string, any>) {
    const { children, ...htmlProps } = props;
    const { isLazy, lazyBehavior } = useTabsContext();
    const { isSelected, id, tabId } = useTabPanelContext();

    const hasBeenSelected = useRef(false);
    if (isSelected) {
        hasBeenSelected.current = true;
    }

    const shouldRenderChildren = lazyControl({
        wasSelected: hasBeenSelected.current,
        isSelected,
        enabled: isLazy,
        mode: lazyBehavior
    });

    return {
        // Puts the tabpanel in the page `Tab` sequence.
        tabIndex: 0,
        ...htmlProps,
        children: shouldRenderChildren ? children : null,
        role: "tabpanel",
        "aria-labelledby": tabId,
        hidden: !isSelected,
        id
    };
}

function makeTabId(id: string, index: number) {
    return `${id}--tab-${index}`;
}

function makeTabPanelId(id: string, index: number) {
    return `${id}--tabpanel-${index}`;
}
