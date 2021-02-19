import React from 'react';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { compose } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    height: 'max'
  },
});

function Dashboard(props) {

  const { classes, auth, user } = props;

  if (!auth.uid) return <Redirect to='/signin' />
  if (user.admin === false) return <Redirect to='/orders/create' />

  return (
    <div>
      <Paper 
      className={classes.root} 
      elevation={1}
    >
        <Typography variant="h5" component="h3">
          This is the Dashboard Page.
        </Typography>
        <Typography component="p">
          This will display as the default if nothing else is selected.
        </Typography>
      </Paper>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    user: state.firebase.profile 
  }
}

export default compose (
  connect(mapStateToProps),
  withStyles(styles)  
)(Dashboard)