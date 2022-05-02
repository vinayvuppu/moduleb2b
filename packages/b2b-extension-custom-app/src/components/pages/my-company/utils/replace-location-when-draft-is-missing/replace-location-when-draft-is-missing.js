import { renderNothing, branch, lifecycle, compose } from 'recompose';

// When the user acceses any intermediate step of the order-create form we
// need to redirect him to the first step, because the cart has to be
// created first.
export default branch(
  // when the cart draft is missing or the id of the cart draft
  props => !props.cartDraft || !props.cartDraft.id,
  // we get the router and redirect when the component mounts
  compose(
    // withRouter,
    lifecycle({
      UNSAFE_componentWillMount() {
        // We can count on the router to be in the props as this is only used
        // for routing components for now. Otherwise, enable the `withRouter`
        // line in `compose` above.
        this.props.goToFirstStep();
      },
    }),
    renderNothing
  )
  // by not adding the "right" argument here, `branch` will render the component
);
