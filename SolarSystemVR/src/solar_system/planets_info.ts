
export class PlanetInfo
{
  public planetsInfo1: string[];
  public planetsInfo2: string[];

  constructor()
  {
    this.planetsInfo1 = [];
    this.planetsInfo2 = [];

    this.mercury();
    this.venus();
    this.earth();
    this.mars();
    this.jupiter();
    this.saturn();
    this.uranus();
    this.neptune();
  }

  private mercury()
  {
    this.planetsInfo1.push
    (
      "Size: 4,879 km \n" + "Distance from Sun: 57,900,000 km (0.39 AU)"
    );
  }

  private venus()
  {
    this.planetsInfo1.push
    (
      "Size: 12,104 km \n" + "Distance from Sun: 108,200,000 km (0.72 AU)"
    );
  }

  private earth()
  {
    this.planetsInfo1.push
    (
      "Size: 12,756 km \n" + "Distance from Sun: 149,600,000 km (1.0 AU)"
    );
  }

  private mars()
  {
    this.planetsInfo1.push
    (
      "Size: 6,792 km \n" + "Distance from Sun: 227,900,000 km (1.52 AU)"
    );
  }

  private jupiter()
  {
    this.planetsInfo1.push
    (
      "Size: 142,984 km \n" + "Distance from Sun: 778,600,000 km (5.2 AU)"
    );
  }

  private saturn()
  {
    this.planetsInfo1.push
    (
      "Size: 120,536 km \n" + "Distance from Sun: 1,433,500,000 km (9.54 AU)"
    );
  }

  private uranus()
  {
    this.planetsInfo1.push
    (
      "Size: 51,118 km \n" + "Distance from Sun: 2,872,500,000 km (19.2AU)"
    );
  }

  private neptune()
  {
    this.planetsInfo1.push
    (
      "Size: 49,528 km \n" + "Distance from Sun: 4,495,100,000 km (30.06 AU)"
    );
  }
}




