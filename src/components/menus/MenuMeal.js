import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import grey from '@material-ui/core/colors/grey'

const styles = theme => ({
  card: {
    flex: 1,
    marginTop: 5,
    paddingTop: 5,
    [theme.breakpoints.down('sm')]: {
      maxWidth: 375,
    },

  },
  title: {
    color: grey[800],
    fontSize: 18,
    fontWeight: 'bold'
  },
  subheader: {
    color: grey[800],
    fontSize: 16
  },
  button: {
    paddingBottom: 0, 
    paddingTop: 0
  }
})

class MenuMeal extends Component {

  onSubmit = () => {
    this.props.onSubmit(this.props.meal)
  }


  render() {
    const { classes, meal, buttonText } = this.props
  
    return (
      <Card 
        className={classes.card}
        elevation={5}
        >
        <CardHeader
          classes={{
            title: classes.title,
            subheader: classes.subheader
          }}
          title={meal.title}
          subheader={meal.subheader}
          style={{paddingBottom: 0, paddingTop: 0}}
        />
        <Button 
          size="large" 
          color="primary" 
          className={classes.button}
          onClick={this.onSubmit}
        >
          {buttonText}
        </Button>
      </Card>
    );
  }
}

MenuMeal.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(MenuMeal)
