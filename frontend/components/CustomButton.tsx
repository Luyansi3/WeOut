import React from 'react';
import { Button, ButtonProps, Text, XStack } from 'tamagui'; 


interface CustomButtonProps extends ButtonProps {
    title: string;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    endCircle?: boolean;
    textColor?: string;
    fontSize?: number;
    fontWeight?: string;

}

// global var
const customColors = {
    background: "#F5F5F7",
    pink: "#FF3C78",
    purple: "#8F00FF",
    textSecond: "#747688",
    textMain: "#1A1B41"
};





const CustomButton: React.FC<CustomButtonProps> = ({
    title,
    startIcon,
    endIcon,
    endCircle = false,
    textColor = "white",
    fontSize = 16,
    fontWeight = "500",
    ...rest
}) => {

    // default arrow inside a white circle
    let trailingIcon: React.ReactNode;

    // si on veut avoir un cercle autour de l'icone
    if (endCircle) {
        trailingIcon = (
            <XStack position="absolute" right={16}>


                {/* Le rond et l'icone: */}
                <XStack
                    width={32}
                    height={32}
                    borderRadius={16}
                    backgroundColor="white"
                    alignItems="center"
                    justifyContent="center">

                    {endIcon}    
                </XStack>



            </XStack>
        );

    }
    else {
        trailingIcon = (
            <XStack position="absolute" right={16}>
                {endIcon}   
            </XStack>
        );
    }


    return (
        <Button  {...rest}>
            {startIcon}
            <XStack alignItems="center" justifyContent="center">

                <Text fontSize={fontSize} fontWeight={fontWeight} color={textColor}>
                    {title}
                </Text>

            </XStack>
            {trailingIcon}
        </Button>
    );
};

export default CustomButton;