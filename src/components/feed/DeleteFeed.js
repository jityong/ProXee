import React, { Component } from 'react'
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import DeleteIcon from '@material-ui/icons/Delete';
//redux
import { deleteFeed, clearErrors } from "../../redux/actions/dataActions";
import { connect } from "react-redux";
import MyButton from '../../util/MyButton';


export class DeleteFeed extends Component {
    state = { 
        temp: this.props.data.temp,
    }
    handleClick = () => {
        this.props.deleteFeed(this.props.feedId)
        this.setState({temp:!this.state.temp})
    }
    render() {
        return (
            <div>
                <MyButton onClick={this.handleClick} tip="delete">
                    <DeleteIcon/>
                </MyButton>
            </div>
        )
    }
}

DeleteFeed.propTypes = {
    deleteFeed: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    feedId: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    UI: state.UI,
    data: state.data
  });
export default connect(
    mapStateToProps,
    { deleteFeed, clearErrors }
  )(DeleteFeed);
  
