import Float from './float';

const GetPosition = grid =>
    `
vec4 _get_position_(){
    float x = float(${grid[0].name})/${Float(grid[0].scale / 2)}-1.0;
    float y = 1.0-float(${grid[1].name})/${Float(grid[1].scale / 2)};
    return vec4(x,y, 0.0, 1.0);
}
`;

const GetPositionMethod = (grid) => {
    if (!grid) throw new Error("Grid is required");
    return GetPosition(grid);
};

export default GetPositionMethod;