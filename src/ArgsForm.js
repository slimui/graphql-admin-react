import React, { Component } from 'react';
import SimpleArgField from './SimpleArgField';
import ArgField from './ArgField';
import { findInputFields, findType, findEffectiveType, findEnumValues, isEnum } from './graphql_utils';

class ArgsForm extends Component {

  constructor(props) {
    super(props);
    this.state = {argValues: {} };
  }

  argValueChange(name, value) {
    if (Array.isArray(name)) {
      let argValues = this.state.argValues;
      let currentObject = argValues;
      name.forEach((path, index) => {
        if (index < (name.length - 1)) {
          currentObject[path] = currentObject[path] ? currentObject[path] : {};
          currentObject = currentObject[path];
        } else {
          currentObject[path] = value;
        }
      });
      this.setState({ argValues });
    } else {
      this.setState({argValues: Object.assign(this.state.argValues, {[name] : value })});
    }
  }

  renderEnumField(arg, prefix) {
    const enumValues = findEnumValues(this.props.schema, findEffectiveType(arg.type).name);
    return (
      <div>
        <label>{arg.name}</label>
        <select name={arg.name} onChange={ (event)=> this.argValueChange(prefix.concat(arg.name) : arg.name, event.target.value)}>
          { enumValues.map( (enumValue) => (
              <option>{enumValue.name}</option>
            ))
          }
        </select>
      </div>
    );
  }


  renderArgField(arg, prefix=[]) {
    if (arg.type.kind == "INPUT_OBJECT") {
      return this.renderInputObjectFields(arg, prefix);
    } else if (isEnum(arg)) {
      return this.renderEnumField(arg, prefix);
    } else {
      return (
      <SimpleArgField
        prefix={prefix}
        arg={arg}
        onChange={(event)=> this.argValueChange(prefix.concat(arg.name) : arg.name, event.target.value)}
      />
      );

    }
  }

  renderInputObjectFields(arg, prefix=[]) {
    return findInputFields(this.props.schema, arg.type.name)
      .map( simpleField => this.renderArgField(simpleField, prefix.concat(arg.name)));
  }

  render() {
    return (
      <form>
        {this.props.args.map((arg) => (
          <ArgField
            arg={arg}
            schema={this.props.schema}
            onChange={ (event)=> this.argValueChange(arg.name, event.target.value) }
          />
        ))}
        <input type="button" value={this.props.buttonLabel} onClick={ () => this.props.onExecute(this.state.argValues)  } />
      </form>
    );
  }
}

export default ArgsForm;
