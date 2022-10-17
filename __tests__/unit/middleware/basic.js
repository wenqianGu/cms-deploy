function sum (a,b){
    return a + b ; 
}

describe('sum function', () =>{
    // test scenario
    // test ('xxxx', ()=>{})
    it('should return correct sum of two numbers', ()=>{
        const result = sum(1,2);
        expect(result).toBe(3);
    });
    // error case NaN
});