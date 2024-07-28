import { m } from 'framer-motion';

import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton';

import { varHover } from '../animate/variants/actions';
import CustomPopover, { usePopover } from '../custom-popover/use-popover';

export default function AccountPopover() {
    const popover = usePopover();

    return (
        <>
            <IconButton
                component={m.button}
                whileTap="tap"
                whileHover="hover"
                varaints={varHover(1.05)}
                onClick={popover.onOpen}
                sx={{
                    width: 40,
                    height: 40,
                    background: (theme) => alpha(theme.palette.grey[500], 0.08),
                    ...(popover.open && {
                        background: (theme) =>
                        `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                    }),
                }}
            >
                <Avatar
                    sx={{
                        width: 36,
                        height: 36,
                        border: (theme) => `solid 2px ${theme.palette.background.default}`,
                    }}
                >

                </Avatar>
            </IconButton>

            <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 200, p: 0 }}>
                <Box sx={{ p: 2, pb: 1.5 }}>
                <Typography variant="subtitle2" noWrap>
                    {user?.displayName}
                </Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                    {user?.email}
                </Typography>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Stack sx={{ p: 1 }}>
                {OPTIONS.map((option) => (
                    <MenuItem key={option.label} onClick={() => handleClickItem(option.linkTo)}>
                    {option.label}
                    </MenuItem>
                ))}
                </Stack>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <MenuItem
                onClick={handleLogout}
                sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'error.main' }}
                >
                Logout
                </MenuItem>
            </CustomPopover>
        </>
    )
}