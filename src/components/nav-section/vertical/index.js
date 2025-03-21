import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { List, Box, ListSubheader } from '@mui/material';
//
import { NavListRoot } from './NavList';
// hooks
import useAuth from '../../../hooks/useAuth';

// ----------------------------------------------------------------------

export const ListSubheaderStyle = styled((props) => <ListSubheader disableSticky disableGutters {...props} />)(
  ({ theme }) => ({
    ...theme.typography.overline,
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    color: theme.palette.text.primary,
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shorter,
    }),
  })
);

// ----------------------------------------------------------------------

NavSectionVertical.propTypes = {
  isCollapse: PropTypes.bool,
  navConfig: PropTypes.array,
};

export default function NavSectionVertical({ navConfig, isCollapse = false, ...other }) {
  const { user } = useAuth();

  return (
    <Box {...other}>
      {navConfig.map((group) => {
        if (group.subheader === 'management' && user.role !== 'admin') {
          return null;
        }

        return (
          <List key={group.subheader} disablePadding sx={{ px: 2 }}>
            <ListSubheaderStyle
              sx={{
                ...(isCollapse && {
                  opacity: 0,
                }),
              }}
            >
              {group.subheader}
            </ListSubheaderStyle>
            {
              // only render list items for non-management items or for admin users managing the management list
              (group.subheader !== 'management' || (group.subheader === 'management' && user.role === 'admin')) &&
                group.items.map((list) => {
                  if (list.role === 'admin' && user.role !== 'admin') {
                    return null;
                  }
                  return <NavListRoot key={list.title} list={list} isCollapse={isCollapse} />;
                })
            }
          </List>
        );
      })}
    </Box>
  );
}
