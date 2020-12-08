const getCanvasDatagrid = () => cy.window().its('canvasDatagrid');

const getGrid = () => cy.get('#grid').children().first();

const createGrid = (options = {}) =>
  getCanvasDatagrid().then((canvasDataGrid) => {
    const grid = canvasDataGrid(options || {});

    cy.get('#grid').then((container) => {
      container.get(0).appendChild(grid);
    });
  });

context('Integration', () => {
  beforeEach(() => {
    cy.visit('http://localhost:9000/');

    createGrid({ style: { height: '400px' } });
  });

  it('should mount', () => {
    getGrid().then((grid) => {
      cy.get('canvas-datagrid').should('exist');
    });
  });
});
