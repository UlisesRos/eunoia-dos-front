import { Stack, Button } from "@chakra-ui/react";

const WeekSelector = ({ currentWeek, onWeekChange, availableWeeks }) => {
    return (
        <Stack
            direction={{ base: 'column', sm: 'row' }}
            spacing={2}
            justify="center"
            align="center"
            mb={4}
            >
            {availableWeeks.map((week) => (
                <Button
                key={week}
                onClick={() => onWeekChange(week)}
                border="2px solid"
                borderColor="brand.secondary"
                fontWeight="bold"
                bg={currentWeek === week ? "brand.secondary" : "brand.primary"}
                color={currentWeek === week ? "brand.primary" : "brand.secondary"}
                w={{ base: 'full', sm: 'auto' }}
                >
                    Semana {week}
                </Button>
            ))}
        </Stack>
    );
};

export default WeekSelector;

