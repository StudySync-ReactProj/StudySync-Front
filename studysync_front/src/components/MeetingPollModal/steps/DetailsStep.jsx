import {
    Stack,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
    Box,
} from '@mui/material';
import {
    Videocam as VideocamIcon,
    LocationOn as LocationOnIcon,
} from '@mui/icons-material';
import TextFieldComp from '../../../components/TextFieldComp/TextFieldComp';
import ButtonCont from '../../../components/ButtonCont/ButtonCont';

export default function DetailsStep({ formData, updateForm, onNext, onCancel }) {
    return (
        <Stack spacing={3}>
            <Typography variant="h5" fontWeight={600} color="primary.main">
                Meeting Details
            </Typography>

            <TextFieldComp
                inputLabel="Title"
                inputName="title"
                inputValue={formData.title}
                handleIChange={(e) => updateForm('title', e.target.value)}
                placeholder="Enter meeting title"
            />

            <TextFieldComp
                inputLabel="Description"
                inputName="description"
                inputValue={formData.description}
                handleIChange={(e) => updateForm('description', e.target.value)}
                multiline
                rows={4}
                placeholder="Enter meeting description"
            />
            <Box>
                <Typography variant="subtitle1" fontWeight={500} mb={1.5}>
                    Location
                </Typography>
                <ToggleButtonGroup
                    value={formData.locationType}
                    exclusive
                    onChange={(e, value) => value && updateForm('locationType', value)}
                    fullWidth
                    sx={{
                        '& .MuiToggleButton-root': {
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: 'none',
                        },
                    }}
                >
                    <ToggleButton value="online">
                        <Stack direction="row" spacing={1} alignItems="center">
                            <VideocamIcon />
                            <Typography>Online</Typography>
                        </Stack>
                    </ToggleButton>
                    <ToggleButton value="offline">
                        <Stack direction="row" spacing={1} alignItems="center">
                            <LocationOnIcon />
                            <Typography>Offline</Typography>
                        </Stack>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
                <ButtonCont
                    text="Cancel"
                    variant="outlined"
                    onClick={onCancel}
                />
                <ButtonCont
                    text="Next"
                    onClick={onNext}
                    disabled={!formData.title.trim()}
                />
            </Stack>
        </Stack>
    );
}
