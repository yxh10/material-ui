import React from 'react';
import transitions from '../styles/transitions';
import ColorManipulator from '../utils/colorManipulator';
import {createChildFragment} from '../utils/childUtils';
import EnhancedButton from '../internal/EnhancedButton';
import Paper from '../Paper';

function validateLabel(props, propName, componentName) {
  if (!props.children && !props.label && !props.icon) {
    return new Error(`Required prop label or children or icon was not specified in ${componentName}.`);
  }
}

function getStyles(props, context, state) {
  const {
    baseTheme,
    button,
    raisedButton,
  } = context.muiTheme;

  const {
    disabled,
    disabledBackgroundColor,
    disabledLabelColor,
    fullWidth,
    icon,
    label,
    labelPosition,
    primary,
    secondary,
    style,
  } = props;

  const amount = (primary || secondary) ? 0.4 : 0.08;

  let backgroundColor = raisedButton.color;
  let labelColor = raisedButton.textColor;

  if (disabled) {
    backgroundColor = disabledBackgroundColor || raisedButton.disabledColor;
    labelColor = disabledLabelColor || raisedButton.disabledTextColor;
  } else if (primary) {
    backgroundColor = raisedButton.primaryColor;
    labelColor = raisedButton.primaryTextColor;
  } else if (secondary) {
    backgroundColor = raisedButton.secondaryColor;
    labelColor = raisedButton.secondaryTextColor;
  } else {
    if (props.backgroundColor) {
      backgroundColor = props.backgroundColor;
    }
    if (props.labelColor) {
      labelColor = props.labelColor;
    }
  }

  return {
    root: {
      display: 'inline-block',
      minWidth: fullWidth ? '100%' : button.minWidth,
      height: button.height,
      transition: transitions.easeOut(),
    },
    container: {
      position: 'relative',
      height: '100%',
      width: '100%',
      padding: 0,
      overflow: 'hidden',
      borderRadius: 2,
      transition: transitions.easeOut(),
      backgroundColor: backgroundColor,
      // That's the default value for a button but not a link
      textAlign: 'center',
    },
    label: {
      position: 'relative',
      verticalAlign: 'middle',
      opacity: 1,
      fontSize: '14px',
      letterSpacing: 0,
      textTransform: raisedButton.textTransform || button.textTransform || 'uppercase',
      fontWeight: raisedButton.fontWeight,
      margin: 0,
      userSelect: 'none',
      paddingLeft: icon && labelPosition !== 'before' ? 8 : baseTheme.spacing.desktopGutterLess,
      paddingRight: icon && labelPosition === 'before' ? 8 : baseTheme.spacing.desktopGutterLess,
      lineHeight: style && style.height || `${button.height}px`,
      color: labelColor,
    },
    icon: {
      lineHeight: style && style.height || `${button.height}px`,
      verticalAlign: 'middle',
      marginLeft: label && labelPosition !== 'before' ? 12 : 0,
      marginRight: label && labelPosition === 'before' ? 12 : 0,
    },
    overlay: {
      backgroundColor: state.hovered && !disabled && ColorManipulator.fade(labelColor, amount),
      transition: transitions.easeOut(),
      top: 0,
    },
    ripple: {
      color: labelColor,
      opacity: !(primary || secondary) ? 0.1 : 0.16,
    },
  };
}

class RaisedButton extends React.Component {
  static muiName = 'RaisedButton';

  static propTypes = {
    /**
     * Override the background color. Always takes precedence unless the button is disabled.
     */
    backgroundColor: React.PropTypes.string,

    /**
     * This is what will be displayed inside the button.
     * If a label is specified, the text within the label prop will
     * be displayed. Otherwise, the component will expect children
     * which will then be displayed. (In our example,
     * we are nesting an `<input type="file" />` and a `span`
     * that acts as our label to be displayed.) This only
     * applies to flat and raised buttons.
     */
    children: React.PropTypes.node,

    /**
     * The css class name of the root element.
     */
    className: React.PropTypes.string,

    /**
     * Disables the button if set to true.
     */
    disabled: React.PropTypes.bool,

    /**
     * Override the background color if the button is disabled.
     */
    disabledBackgroundColor: React.PropTypes.string,

    /**
     * Color of the label if disabled is true.
     */
    disabledLabelColor: React.PropTypes.string,

    /**
     * If true, then the button will take up the full
     * width of its container.
     */
    fullWidth: React.PropTypes.bool,

    /**
     * URL to link to when button clicked if `linkButton` is set to true.
     */
    href: React.PropTypes.string,

    /**
     * Use this property to display an icon.
     */
    icon: React.PropTypes.node,

    /**
     * The label for the button.
     */
    label: validateLabel,

    /**
     * The color of the label for the button.
     */
    labelColor: React.PropTypes.string,

    /**
     * Place label before or after the passed children.
     */
    labelPosition: React.PropTypes.oneOf([
      'before',
      'after',
    ]),

    /**
     * Override the inline-styles of the button's label element.
     */
    labelStyle: React.PropTypes.object,

    /**
     * Enables use of `href` property to provide a URL to link to if set to true.
     */
    linkButton: React.PropTypes.bool,

    /**
     * Callback function for when the mouse is pressed down inside this element.
     */
    onMouseDown: React.PropTypes.func,

    /**
     * Callback function for when the mouse enters this element.
     */
    onMouseEnter: React.PropTypes.func,

    /**
     * Callback function for when the mouse leaves this element.
     */
    onMouseLeave: React.PropTypes.func,

    /**
     * Callback function for when the mouse is realeased
     * above this element.
     */
    onMouseUp: React.PropTypes.func,

    /**
     * Callback function for when a touchTap event ends.
     */
    onTouchEnd: React.PropTypes.func,

    /**
     * Callback function for when a touchTap event starts.
     */
    onTouchStart: React.PropTypes.func,

    /**
     * If true, colors button according to
     * primaryTextColor from the Theme.
     */
    primary: React.PropTypes.bool,

    /**
     * Override the inline style of ripple element.
     */
    rippleStyle: React.PropTypes.object,

    /**
     * If true, colors button according to secondaryTextColor from the theme.
     * The primary prop has precendent if set to true.
     */
    secondary: React.PropTypes.bool,

    /**
     * Override the inline-styles of the root element.
     */
    style: React.PropTypes.object,
  };

  static defaultProps = {
    disabled: false,
    labelPosition: 'after',
    fullWidth: false,
    primary: false,
    secondary: false,
  };

  static contextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  };

  state = {
    hovered: false,
    touched: false,
    initialZDepth: 0,
    zDepth: 0,
  };

  componentWillMount() {
    const zDepth = this.props.disabled ? 0 : 1;
    this.setState({
      zDepth: zDepth,
      initialZDepth: zDepth,
    });
  }

  componentWillReceiveProps(nextProps) {
    const zDepth = nextProps.disabled ? 0 : 1;
    this.setState({
      zDepth: zDepth,
      initialZDepth: zDepth,
    });
  }

  handleMouseDown = (event) => {
    // only listen to left clicks
    if (event.button === 0) {
      this.setState({zDepth: this.state.initialZDepth + 1});
    }
    if (this.props.onMouseDown) this.props.onMouseDown(event);
  };

  handleMouseUp = (event) => {
    this.setState({zDepth: this.state.initialZDepth});
    if (this.props.onMouseUp) this.props.onMouseUp(event);
  };

  handleMouseLeave = (event) => {
    if (!this.refs.container.isKeyboardFocused()) this.setState({zDepth: this.state.initialZDepth, hovered: false});
    if (this.props.onMouseLeave) this.props.onMouseLeave(event);
  };

  handleMouseEnter = (event) => {
    if (!this.refs.container.isKeyboardFocused() && !this.state.touch) {
      this.setState({hovered: true});
    }
    if (this.props.onMouseEnter) this.props.onMouseEnter(event);
  };

  handleTouchStart = (event) => {
    this.setState({
      touch: true,
      zDepth: this.state.initialZDepth + 1,
    });
    if (this.props.onTouchStart) this.props.onTouchStart(event);
  };

  handleTouchEnd = (event) => {
    this.setState({zDepth: this.state.initialZDepth});
    if (this.props.onTouchEnd) this.props.onTouchEnd(event);
  };

  handleKeyboardFocus = (event, keyboardFocused) => {
    const styles = getStyles(this.props, this.context);

    if (keyboardFocused && !this.props.disabled) {
      this.setState({
        zDepth: this.state.initialZDepth + 1,
      });
      const amount = (this.props.primary || this.props.secondary) ? 0.4 : 0.08;
      this.refs.overlay.style.backgroundColor =
        ColorManipulator.fade(Object.assign({}, styles.label, this.props.labelStyle).color, amount);
    } else if (!this.state.hovered) {
      this.setState({
        zDepth: this.state.initialZDepth,
      });
      this.refs.overlay.style.backgroundColor = 'transparent';
    }
  };

  render() {
    const {
      children,
      className,
      disabled,
      icon,
      label,
      labelPosition,
      labelStyle,
      primary, // eslint-disable-line no-unused-vars
      rippleStyle,
      secondary, // eslint-disable-line no-unused-vars
      ...other,
    } = this.props;

    const {prepareStyles} = this.context.muiTheme;
    const styles = getStyles(this.props, this.context, this.state);
    const mergedRippleStyles = Object.assign({}, styles.ripple, rippleStyle);

    const buttonEventHandlers = disabled ? {} : {
      onMouseDown: this.handleMouseDown,
      onMouseUp: this.handleMouseUp,
      onMouseLeave: this.handleMouseLeave,
      onMouseEnter: this.handleMouseEnter,
      onTouchStart: this.handleTouchStart,
      onTouchEnd: this.handleTouchEnd,
      onKeyboardFocus: this.handleKeyboardFocus,
    };

    const labelElement = label && (
      <span style={prepareStyles(Object.assign(styles.label, labelStyle))}>
        {label}
      </span>
    );

    const iconCloned = icon && React.cloneElement(icon, {
      color: styles.label.color,
      style: styles.icon,
    });

    // Place label before or after children.
    const childrenFragment = labelPosition === 'before' ?
    {
      labelElement,
      iconCloned,
      children,
    } : {
      children,
      iconCloned,
      labelElement,
    };

    const enhancedButtonChildren = createChildFragment(childrenFragment);

    return (
      <Paper
        className={className}
        style={Object.assign(styles.root, this.props.style)}
        zDepth={this.state.zDepth}
      >
        <EnhancedButton
          {...other}
          {...buttonEventHandlers}
          ref="container"
          disabled={disabled}
          style={styles.container}
          focusRippleColor={mergedRippleStyles.color}
          touchRippleColor={mergedRippleStyles.color}
          focusRippleOpacity={mergedRippleStyles.opacity}
          touchRippleOpacity={mergedRippleStyles.opacity}
        >
          <div
            ref="overlay"
            style={prepareStyles(styles.overlay)}
          >
            {enhancedButtonChildren}
          </div>
        </EnhancedButton>
      </Paper>
    );
  }
}

export default RaisedButton;
