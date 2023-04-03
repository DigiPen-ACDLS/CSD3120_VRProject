
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

    this.planetsInfo2.push
    (
      "Mercury\n\n" + "Size: 4,879 km \n" + "Distance from Sun: 57,900,000 km (0.39 AU)\n\n" +
      "The smallest planet in our solar system and nearest to the Sun, Mercury is only slightly larger than Earth's Moon.\n\n" +
      "From the surface of Mercury, the Sun would appear more than three times as large as it does when viewed from Earth, and the sunlight would be as much as 11 times brighter." +
      "Despite its proximity to the Sun, Mercury is not the hottest planet in our solar system."
    );
  }

  private venus()
  {
    this.planetsInfo1.push
    (
      "Size: 12,104 km \n" + "Distance from Sun: 108,200,000 km (0.72 AU)"
    );

    this.planetsInfo2.push
    (
      "Venus\n\n" + "Size: 12,104 km \n" + "Distance from Sun: 108,200,000 km (0.72 AU)\n\n" +
      "Venus is the second planet from the Sun and is Earth’s closest planetary neighbor. It’s one of the four inner, terrestrial (or rocky) planets, and it’s often called Earth’s twin because it’s similar in size and density.\n\n" +
      "Venus has a thick, toxic atmosphere filled with carbon dioxide and it’s perpetually shrouded in thick, yellowish clouds of sulfuric acid that trap heat, causing a runaway greenhouse effect. It’s the hottest planet in our solar system, even though Mercury is closer to the Sun."
    );
  }

  private earth()
  {
    this.planetsInfo1.push
    (
      "Size: 12,756 km \n" + "Distance from Sun: 149,600,000 km (1.0 AU)"
    );

    this.planetsInfo2.push
    (
      "Earth\n\n" + "Size: 12,756 km \n" + "Distance from Sun: 149,600,000 km (1.0 AU)\n\n" +
      "Our home planet is the third planet from the Sun, and the only place we know of so far that’s inhabited by living things.\n\n" +
      "While Earth is only the fifth largest planet in the solar system, it is the only world in our solar system with liquid water on the surface."
    );
  }

  private mars()
  {
    this.planetsInfo1.push
    (
      "Size: 6,792 km \n" + "Distance from Sun: 227,900,000 km (1.52 AU)"
    );

    this.planetsInfo2.push
    (
      "Mars\n\n" + "Size: 6,792 km \n" + "Distance from Sun: 227,900,000 km (1.52 AU)\n\n" +
      "​Mars is the fourth planet from the Sun – a dusty, cold, desert world with a very thin atmosphere. Mars is also a dynamic planet with seasons, polar ice caps, canyons, extinct volcanoes, and evidence that it was even more active in the past."
    );
  }

  private jupiter()
  {
    this.planetsInfo1.push
    (
      "Size: 142,984 km \n" + "Distance from Sun: 778,600,000 km (5.2 AU)"
    );

    this.planetsInfo2.push
    (
      "Jupiter\n\n" + "Size: 142,984 km \n" + "Distance from Sun: 778,600,000 km (5.2 AU)\n\n" +
      "Fifth in line from the Sun, Jupiter is, by far, the largest planet in the solar system – more than twice as massive as all the other planets combined.\n\n" +
      "Jupiter's familiar stripes and swirls are actually cold, windy clouds of ammonia and water, floating in an atmosphere of hydrogen and helium. Jupiter’s iconic Great Red Spot is a giant storm bigger than Earth that has raged for hundreds of years."
    );
  }

  private saturn()
  {
    this.planetsInfo1.push
    (
      "Size: 120,536 km \n" + "Distance from Sun: 1,433,500,000 km (9.54 AU)"
    );

    this.planetsInfo2.push
    (
      "Saturn\n\n" + "Size: 120,536 km \n" + "Distance from Sun: 1,433,500,000 km (9.54 AU)\n\n" +
      "Saturn is the sixth planet from the Sun and the second-largest planet in our solar system.\n\n" +
      "Adorned with thousands of beautiful ringlets, Saturn is unique among the planets."
    );
  }

  private uranus()
  {
    this.planetsInfo1.push
    (
      "Size: 51,118 km \n" + "Distance from Sun: 2,872,500,000 km (19.2AU)"
    );

    this.planetsInfo2.push
    (
      "Uranus\n\n" + "Size: 51,118 km \n" + "Distance from Sun: 2,872,500,000 km (19.2AU)\n\n" +
      "Uranus is the seventh planet from the Sun, and has the third-largest diameter in our solar system. It was the first planet found with the aid of a telescope."
    );
  }

  private neptune()
  {
    this.planetsInfo1.push
    (
      "Size: 49,528 km \n" + "Distance from Sun: 4,495,100,000 km (30.06 AU)"
    );

    this.planetsInfo2.push
    (
      "Neptune\n\n" + "Size: 49,528 km \n" + "Distance from Sun: 4,495,100,000 km (30.06 AU)\n\n" +
      "Dark, cold, and whipped by supersonic winds, ice giant Neptune is the eighth and most distant planet in our solar system.\n\n" +
      "More than 30 times as far from the Sun as Earth, Neptune is the only planet in our solar system not visible to the naked eye and the first predicted by mathematics before its discovery."
    );
  }
}




