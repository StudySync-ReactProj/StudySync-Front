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

export default function DetailsStep({ formData, updateForm }) {
    return (
        <Stack spacing={1}>
            <Typography variant="h6" fontWeight={600} color="primary.main" sx={{ mb: 0.5 }}>
                Meeting Details
            </Typography>

            <TextFieldComp
                inputLabel="Title"
                inputName="title"
                inputValue={formData.title}
                handleIChange={(e) => updateForm('title', e.target.value)}
                placeholder="Enter meeting title"
                size="small"
            />

            <TextFieldComp
                inputLabel="Description"
                inputName="description"
                inputValue={formData.description}
                handleIChange={(e) => updateForm('description', e.target.value)}
                multiline
                rows={2}
                placeholder="Enter meeting description"
                size="small"
            />
            <Box>
                <Typography variant="subtitle2" fontWeight={500} mb={1}>
                    Location
                </Typography>
                <ToggleButtonGroup
                    value={formData.locationType}
                    exclusive
                    onChange={(e, value) => value && updateForm('locationType', value)}
                    fullWidth
                    size="small"
                    sx={{
                        '& .MuiToggleButton-root': {
                            py: 1,
                            borderRadius: 1,
                            textTransform: 'none',
                            fontSize: '0.875rem',
                        },
                    }}
                >
                    <ToggleButton value="online">
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <VideocamIcon fontSize="small" />
                            <Typography variant="body2">Online</Typography>
                        </Stack>
                    </ToggleButton>
                    <ToggleButton value="offline">
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <LocationOnIcon fontSize="small" />
                            <Typography variant="body2">Offline</Typography>
                        </Stack>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
        </Stack>
    );
}