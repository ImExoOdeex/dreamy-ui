import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Avatar,
    AvatarGroup,
    Button,
    Checkbox,
    CheckboxCard,
    CheckboxGroup,
    Field,
    FieldError,
    FieldErrorIcon,
    FieldHelpText,
    FieldLabel,
    Image,
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
    MotionBox,
    PinInput,
    PinInputField,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Table,
    TableBody,
    TableCell,
    TableColumnHeader,
    TableHeader,
    TableRow,
    Tabs,
    Textarea,
    TextareaNoAutoSize,
    Tooltip
} from "@dreamy-ui/react";
import {
    Badge,
    Box,
    Divider,
    Flex,
    Grid,
    GridItem,
    HStack,
    Heading,
    type HeadingProps,
    Icon,
    ImageRSC,
    InputRSC,
    Kbd,
    Link,
    List,
    ListItem,
    Progress,
    Skeleton,
    SkeletonText,
    Stack,
    Text,
    TextareaRSC,
    VStack,
    VisuallyHidden
} from "@dreamy-ui/react/rsc";
import type * as mdx from "@mdx-js/react";
import { useLocation } from "@remix-run/react";
import { MDXRemote } from "next-mdx-remote";
import type React from "react";
import { type PropsWithChildren, type ReactNode, useMemo, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { FiCoffee } from "react-icons/fi";
import { HiExternalLink, HiOutlineMail } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import type { MdxContent } from "~/src/.server/docs";
import { PlatformSpecificKbd } from "~/src/ui/docs/components/kbds";
import {
    BasicModal,
    PlacementModal,
    ScrollableInsideModal,
    ScrollableOutsideModal,
    SizeModals
} from "~/src/ui/docs/components/modals";
import {
    BasicPopover,
    ControlledPopover,
    FocusPopover,
    PlacementPopovers
} from "~/src/ui/docs/components/popovers";
import { ControlledTabs, VariantTabs } from "./components/Tabs";
import { CheckboxCardGroupControl, CheckboxGroupControl } from "./components/checkboxes";
import { ControlledSlider, MaxMinSlider } from "./components/sliders";

interface Props {
    mdxContent: MdxContent;
}

export default function MDXContent({ mdxContent }: Props) {
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    return useMemo(() => {
        return (
            <MDXRemote
                {...mdxContent}
                components={components}
            />
        );
    }, [mdxContent.compiledSource]);
}

export function createHId(text: ReactNode) {
    return text
        ?.toString()
        .replaceAll(" ", "-")
        .replaceAll(".", "")
        .replaceAll("/", "")
        .replaceAll("?", "")
        .toLowerCase();
}

const DreamComponents = {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Box,
    Flex,
    Button,
    Icon,
    Heading,
    Link,
    Text,
    Stack,
    VStack,
    HStack,
    Divider,
    Avatar,
    Progress,
    Input,
    Textarea,
    Image,
    Field,
    FieldLabel,
    FieldError,
    FieldErrorIcon,
    FieldHelpText,
    List,
    ListItem,
    BasicModal,
    ScrollableInsideModal,
    ScrollableOutsideModal,
    SizeModals,
    PlacementModal,
    PinInput,
    PinInputField,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
    AvatarGroup,
    Badge,
    BasicPopover,
    ControlledPopover,
    FocusPopover,
    PlacementPopovers,
    Kbd,
    PlatformSpecificKbd,
    ControlledSlider,
    MaxMinSlider,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
    Tabs,
    TabList,
    Tab,
    TabPanel,
    TabPanels,
    VariantTabs,
    ControlledTabs,
    Checkbox,
    CheckboxGroup,
    CheckboxGroupControl,
    CheckboxCard,
    CheckboxCardGroupControl,
    Wrapper,
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableColumnHeader,
    ImageRSC,
    InputRSC,
    TextareaRSC,
    TextareaNoAutoSize,
    Grid,
    GridItem,
    Tooltip,
    VisuallyHidden,
    Skeleton,
    SkeletonText
};

function Wrapper({ children }: PropsWithChildren) {
    return (
        <Flex
            col
            gap={2}
            p={4}
            rounded={"l2"}
            border={"1px solid"}
            borderColor={"border.muted"}
            w={"full"}
        >
            {children}
        </Flex>
    );
}

// interface ComponentCodeProps {
//     code: string;
//     component: React.ReactNode;
// }

// function ComponentCode({ code, component }: ComponentCodeProps) {
//     const [showCode, setShowCode] = useState(false);

//     return (
//         <Flex
//             col
//             w={"auto"}
//         >
//             <HStack>
//                 <Button
//                     variant={"ghost"}
//                     size={"sm"}
//                     onClick={() => setShowCode(false)}
//                 >
//                     Preview
//                 </Button>
//                 <Button
//                     variant={"ghost"}
//                     size={"sm"}
//                     onClick={() => setShowCode(true)}
//                 >
//                     Code
//                 </Button>
//             </HStack>

//             {showCode ? <pre>{code}</pre> : component}
//         </Flex>
//     );
// }

const icons = {
    IoClose,
    HiOutlineMail,
    FiCoffee,
    BiSearch
};

const components = {
    p: (props) => (
        <Text
            mb={2}
            {...props}
        />
    ),
    h1: (props) => (
        <DefaultHeading
            as="h2"
            size={"3xl"}
            mt={10}
            mb={3}
            {...props}
        />
    ),
    h2: (props) => (
        <DefaultHeading
            as="h3"
            size={"2xl"}
            mt={6}
            mb={2}
            {...props}
        />
    ),
    h3: (props) => (
        <DefaultHeading
            as="h4"
            size={"lg"}
            fontWeight={600}
            mt={4}
            mb={1}
            {...props}
        />
    ),
    hr: (props) => (
        <Divider
            my={4}
            {...props}
        />
    ),
    a: ({ href, children, ...props }) => {
        const isExternal = href?.startsWith("http");

        return (
            <Link
                href={href || "#"}
                target={isExternal ? "_blank" : undefined}
                _hover={{
                    textDecoration: "underline"
                }}
                color={"secondary"}
                {...props}
            >
                {children}{" "}
                {isExternal && (
                    <Icon
                        as={HiExternalLink}
                        display={"inline-block"}
                    />
                )}
            </Link>
        );
    },
    em: (props: any) => (
        <Text
            as="em"
            fontStyle="italic"
            {...props}
        />
    ),
    blockquote: (props) => {
        const { children, ...rest } = props as {
            children: any[];
            [key: string]: any;
        };

        if (typeof children !== "object") {
            console.error("blockquote must have object children", children);

            return (
                <Alert
                    {...rest}
                    status="error"
                    boxShadow={"xs"}
                >
                    <AlertIcon />
                    <AlertTitle>Error parsing blockquote</AlertTitle>
                </Alert>
            );
        }

        const contentChildren = children?.find(
            (child) => typeof child === "object" && "props" in child
        ).props.children;

        const status = contentChildren.startsWith("warning:")
            ? "warning"
            : contentChildren.startsWith("error:")
              ? "error"
              : contentChildren.startsWith("info:")
                ? "info"
                : contentChildren.startsWith("success:")
                  ? "success"
                  : "warning";

        const content = contentChildren.replace(/^(warning|error|info|success):/, "");

        return (
            <Alert
                status={status}
                my={4}
                {...rest}
                boxShadow={"xs"}
            >
                <AlertIcon />
                <AlertTitle>{content}</AlertTitle>
            </Alert>
        );
    },
    img: ({ alt = "image", ...props }) => {
        const isFullWidth = props.src?.includes("fullwidth=true");

        return (
            <Flex
                as={"span"}
                w={"fit-content"}
                display={"inline-flex"}
                col
                alignItems={"center"}
                maxW={isFullWidth ? "3xl" : "lg"}
            >
                <Image
                    alt={alt}
                    rounded={"md"}
                    loading="lazy"
                    {...props}
                />
                {alt && (
                    <Text
                        as={"span"}
                        aria-hidden="true"
                        fontWeight={500}
                        fontSize={"sm"}
                        color={"fg.disabled"}
                        bottom={1}
                    >
                        {alt}
                    </Text>
                )}
            </Flex>
        );
    },
    ul: (props) => (
        <List
            unordered
            {...props}
        />
    ),
    ol: (props) => (
        <List
            ordered
            {...props}
        />
    ),
    li: (props) => <ListItem {...props} />,
    strong: (props: any) => (
        <Text
            as="strong"
            {...props}
        />
    ),
    ...DreamComponents,
    ...icons
} satisfies React.ComponentProps<typeof mdx.MDXProvider>["components"];

function DefaultHeading({ mt, mb, ...props }: HeadingProps) {
    const [isHovered, setIsHovered] = useState(false);
    const hash = useLocation().hash;
    const hId = useMemo(() => createHId(props.children), [props.children]);

    return (
        <Flex
            mt={mt}
            mb={mb}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            _first={{ mt: 0 }}
            w={"fit-content"}
            flex={1}
        >
            <MotionBox
                overflow={"hidden"}
                initial={false}
                animate={{
                    width: isHovered ? "auto" : 0,
                    opacity: isHovered ? 1 : 0
                }}
            >
                <Link
                    href={`#${hId}`}
                    cursor="pointer"
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                    }}
                >
                    <Heading
                        id={hId}
                        {...props}
                        pr={1}
                    >
                        #
                    </Heading>
                </Link>
            </MotionBox>

            <Link
                href={`#${hId}`}
                scrollMarginTop={24}
                role="group"
                cursor="pointer"
                w={"fit-content"}
            >
                <Heading
                    id={hId}
                    textDecoration={hash === `#${hId}` ? "underline" : "none"}
                    scrollMarginTop={24}
                    lineClamp={1}
                    _hover={{
                        textDecoration: "underline"
                    }}
                    {...props}
                />
            </Link>
        </Flex>
    );
}
