import styleConstants from './style-constants.js';
import LoginGate from './login-gate.js';
import intersection from 'lodash/intersection';
import Markdown from './markdown.js';

const MultipleChoiceResponse = React.createClass({
  getInitialState: () => ({}),
  async componentDidMount() {
    this.props.allowSaving();
    this.props.addAfterSaveHook((savePromise) => {
      savePromise.then(this.updateFeedback);
    })
  },
  getDefaultProps: () => ({
    response: [],
    automaticResponses: [],
  }),
  toggleChoice(choice) {
    let selectedChoices = this.props.response || [];
    
    // Deselection
    if (selectedChoices.find(selectedChoice => selectedChoice.id === choice.id)) {
      selectedChoices = selectedChoices.filter(selectedChoice => selectedChoice.id !== choice.id);
    }
    // Selection
    else {
      if (this.props.maxSelected === 1) {
        selectedChoices = [choice];
      } else {
        selectedChoices = selectedChoices.concat(choice);
      }
    }
    this.props.setResponse(selectedChoices);
  },
  isChoiceSelected(choice) {
    return this.props.response && this.props.response.find(
      selectedChoice => selectedChoice.id === choice.id);
  },
  updateFeedback() {
    const feedbacks = this.props.automaticResponses || [];
    const selectedChoices = this.props.response || [];
    const selectedChoiceIds = selectedChoices.map(choice => choice.id);
    
    // Check each automatic response to see if the currently selected choices
    // match any answer set provided. Matching is exact set match, first one found.
    const feedbackItem = feedbacks.find((item) => {
      const intersectionSetSize = intersection(selectedChoiceIds, item.answerSet).length;
      return intersectionSetSize === selectedChoiceIds.length &&
        intersectionSetSize === item.answerSet.length;
    });
    
    this.setState({feedback: feedbackItem ? feedbackItem.response : null});
  },
  render() {
    const maxMultiselectionReached = this.props.maxSelected > 1 &&
      this.props.response && this.props.response.length >= this.props.maxSelected;
    
    return (
      <LoginGate>
        <div className="choices">
          {this.props.choices.map((choice) => (
            <button key={choice.id}
                    disabled={maxMultiselectionReached && !this.isChoiceSelected(choice)}
                    className={'choice' + (this.isChoiceSelected(choice) ? ' selected' : '')}
                    onClick={() => this.toggleChoice(choice)}>
              {choice.text}
            </button>
          ))}
        </div>
        {this.state.feedback && (<div className="multiple-choice-selection-feedback">
          <div className="feedback-image" style={{minWidth: '42px'}}>
            <img className="pure-img" src='https://chalees-min.imgix.net/multiple-choice-feedback-instructor.png?w=34&h=34&auto=format&mask=ellipse' />
          </div>
          <Markdown className="feedback-text" source={this.state.feedback} />
        </div>)}
      </LoginGate>
    );
  }
});

export default MultipleChoiceResponse;