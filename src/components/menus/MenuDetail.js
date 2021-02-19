import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
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
import blue from '@material-ui/core/colors/blue'

const styles = theme => ({
  card: {
    maxWidth: 375,
    marginTop: 5,
    paddingTop: 5,
    backgroundColor: blue[50]
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
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
    fontSize: 18,
    fontWeight: 'bold'
  },
  subheader: {
    color: grey[800],
    fontSize: 16
  },
  price: {
    float: 'right', 
    fontWeight: 'bold'
  },
  gridheading: {
    fontSize: 18, 
    fontWeight: 'bold'
  },
  gridamounts: {
    float: 'right'
  }

})

class MenuDetail extends Component {
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
              className={classes.price}
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
              className={classes.price}
            >
              {`$${lprice}`} 
            </Typography>
            <Grid container spacing={24}>
              <Grid item xs={6}>
                <Typography
                  align='center'
                  className={classes.gridheading}
                >
                  Small
                </Typography>
                <Typography inline>
                  Calories:
                </Typography>
                <Typography 
                  inline
                  className={classes.gridamounts}
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
                  className={classes.gridamounts}
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
                  className={classes.gridamounts}
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
                  className={classes.gridamounts}
                >
                  {meal.sfat}g 
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  align='center'
                  className={classes.gridheading}
                >
                  Large
                </Typography>
                <Typography inline>
                  Calories:
                </Typography>
                <Typography 
                  inline
                  className={classes.gridamounts}
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
                  className={classes.gridamounts}
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
                  className={classes.gridamounts}
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
                  className={classes.gridamounts}
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

MenuDetail.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(MenuDetail)
