import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import grey from '@material-ui/core/colors/grey'

import MenuDetail from './MenuDetail'

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
    fontSize: 26,
    textAlign: 'center'
  },
  subheader: {
    color: grey[800],
    fontSize: 18
  },
})

class Menu extends Component {
  state = { expanded: false }

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }))
  }

  render() {
    const { classes, menu } = this.props
    const deliveryDate = moment(menu.deliveryDate)
    const publishDate = moment(menu.publishDate)
    const cutoffDate = moment(menu.cutoffDate)
    const meals = menu.selectedMeals

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
          title={deliveryDate.format('dddd, MMM Do YYYY')}
          style={{paddingBottom: 0, paddingTop: 0}}
        />
        <Typography
          style={{
            fontSize: 16,
            paddingLeft: 10
          }}
        >
          Publish: {publishDate.format('dddd, MMM Do, h:mm a')} <br/>
          Cutoff: {cutoffDate.format('dddd, MMM Do, h:mm a')}
        </Typography>
        <CardActions className={classes.actions} disableActionSpacing>
          <Button 
            size="small" 
            color="primary" 
            className={classes.button}
            component={Link} to= {`/menus/${menu.id}`}
          >
            Edit
          </Button>
          <Button 
            size="small" 
            color="secondary" 
            className={classes.button}
            component={Link} to={`/menu/delete/${menu.id}`}
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
          { meals && meals.map( meal => {
            return (
              <MenuDetail meal={meal} key={meal.id}/>
            )  
          })}
        </Collapse>
      </Card>
    );
  }
}

Menu.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Menu)
