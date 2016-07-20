import spyOnComponent from 'spy-on-component';

export default function registerWithContext(component, submit) {

  function register(context) {
    if (context.reactFormalContext) {
      let { registerSubmit } = context.reactFormalContext;

      if (registerSubmit)
        registerSubmit(submit)
    }
  }

  spyOnComponent(component, {
    componentDidMount() {
      register(this.context);
    },

    componentWillReceiveProps(_, nextContext) {
      register(nextContext);
    }
  })
}
