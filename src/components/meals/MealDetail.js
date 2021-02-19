import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import grey from '@material-ui/core/colors/grey'

const styles = theme => ({
  card: {
    maxWidth: 375,
    marginBottom: 5
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: grey[200],
  },
  title: {
    color: grey[800],
    fontSize: 28
  },
  subheader: {
    color: grey[800],
    fontSize: 18
  },
})

class MealDetail extends Component {
  state = { expanded: false }

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }))
  }

  render() {
    const { classes, meal } = this.props
    const sprice = (meal.sprice/100).toFixed(2)
    const lprice = (meal.lprice/100).toFixed(2)

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
        <CardActions className={classes.actions} disableActionSpacing>
          <Button 
            size="small" 
            color="primary" 
            className={classes.button}
            component={Link} to= {`/meals/${meal.id}`}
          >
            Edit
          </Button>
          <Button 
            size="small" 
            color="secondary" 
            className={classes.button}
            component={Link} to= {`/meal/delete/${meal.id}`}
          >
            Delete
          </Button>
          <IconButton
            className={classnames(classes.expand, {
              [classes.expandOpen]: this.state.expanded,
            })}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent
            style={{paddingBottom: 5, paddingTop: 0}}
          >
            <Typography inline>
              {`Small: ${meal.sportion}`} 
            </Typography>
            <Typography 
              inline
              style={{float: 'right', fontWeight: 'bold'}}
            >
              {`$${sprice}`} 
            </Typography>
            <Typography>
            </Typography>
            <Typography inline>
              {`Large: ${meal.lportion}`} 
            </Typography>
            <Typography 
              inline
              style={{float: 'right', fontWeight: 'bold'}}
            >
              {`$${lprice}`} 
            </Typography>
            <Grid container spacing={24}>
              <Grid item xs={6}>
                <Typography
                  align='center'
                  style={{fontSize: 18, fontWeight: 'bold'}}
                >
                  Small
                </Typography>
                <Typography inline>
                  Calories:
                </Typography>
                <Typography 
                  inline
                  style={{float: 'right'}}
                >
                  {meal.scals} 
                </Typography>
                <Typography>
                </Typography>
                <Typography inline>
                  Protein:
                </Typography>
                <Typography 
                  inline
                  style={{float: 'right'}}
                >
                  {meal.sprotein}g 
                </Typography>
                <Typography>
                </Typography>
                <Typography inline>
                  Carbs:
                </Typography>
                <Typography 
                  inline
                  style={{float: 'right'}}
                >
                  {meal.scarbs}g 
                </Typography>
                <Typography>
                </Typography>
                <Typography inline>
                  Fat:
                </Typography>
                <Typography 
                  inline
                  style={{float: 'right'}}
                >
                  {meal.sfat}g 
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  align='center'
                  style={{fontSize: 18, fontWeight: 'bold'}}
                >
                  Large
                </Typography>
                <Typography inline>
                  Calories:
                </Typography>
                <Typography 
                  inline
                  style={{float: 'right'}}
                >
                  {meal.lcals} 
                </Typography>
                <Typography>
                </Typography>
                <Typography inline>
                  Protein:
                </Typography>
                <Typography 
                  inline
                  style={{float: 'right'}}
                >
                  {meal.lprotein}g 
                </Typography>
                <Typography>
                </Typography>
                <Typography inline>
                  Carbs:
                </Typography>
                <Typography 
                  inline
                  style={{float: 'right'}}
                >
                  {meal.lcarbs}g 
                </Typography>
                <Typography>
                </Typography>
                <Typography inline>
                  Fat:
                </Typography>
                <Typography 
                  inline
                  style={{float: 'right'}}
                >
                  {meal.lfat}g 
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}

MealDetail.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(MealDetail)
