import spyOnComponent from 'spy-on-component';

export default function registerWithContext(component, submit) {

  function register(formKey, context) {
    if (context.reactFormalContext) {
      let { registerForm } = context.reactFormalContext;

      if (registerForm)
        registerForm(formKey || '@@parent', submit)
    }
  }

  spyOnComponent(component, {
    componentDidMount() {
      register(this.props.formKey, this.context);
    },

    componentWillReceiveProps({ formKey }, nextContext) {
      register(formKey, nextContext);
    }
  })
}
