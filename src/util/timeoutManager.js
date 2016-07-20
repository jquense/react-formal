import spyOnComponent from 'spy-on-component';

export default function createTimeoutManager(componentInstance) {
  let unmounted = false;
  let timers = Object.create(null);

  spyOnComponent(componentInstance, {
    componentWillUnmount() {
      unmounted = true;

      for (var k in timers) clearTimeout(timers[k])
      timers = null;
    }
  })

  return {
    clear(key) {
      clearTimeout(timers[key])
    },

    set(key, fn, ms) {
      if (unmounted) return
      timers[key] = setTimeout(fn, ms)
    }
  }
}
