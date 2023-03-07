interface ValueObjectProps {
  [index: string]: any;
}

/**
 * @desc ValueObjects are objects that we determine their
 * equality through their structrual property.
 */

export abstract class ValueObject<TProps extends ValueObjectProps> {
  public props: TProps;

  protected constructor (props: TProps) {
    this.props = {
      ...props,
    };
  }

  public equals (vo?: ValueObject<TProps>) : boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.props === undefined) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}