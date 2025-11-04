-- Create the reports table
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    industry VARCHAR(50) NOT NULL,
    contaminant_type VARCHAR(50), -- Made optional as not always primary input
    flow_rate_m3_hr DECIMAL(10,2), -- Made optional as not always primary input
    tss_mg_l DECIMAL(10,2), -- Made optional as not always primary input
    business_driver VARCHAR(50),
    concept_focus VARCHAR(50) NOT NULL, -- Added: To track the user's entry point/intent
    input_params JSONB, -- Added: To store various inputs flexibly
    daf_surface_area_m2 DECIMAL(10,2),
    daf_capex_min_zar DECIMAL(15,2),
    daf_capex_max_zar DECIMAL(15,2),
    daf_opex_annual_zar DECIMAL(15,2),
    clarifier_surface_area_m2 DECIMAL(10,2),
    clarifier_capex_min_zar DECIMAL(15,2),
    clarifier_capex_max_zar DECIMAL(15,2),
    clarifier_opex_annual_zar DECIMAL(15,2),
    calculated_data JSONB -- Renamed from data_json, stores specific calculation results
);

-- Create the leads table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name VARCHAR(255),
    company VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    cta_type VARCHAR(50),
    concept_focus VARCHAR(50) -- Added: To link lead to the specific intent/spoke
);

-- Add Indexes for performance
CREATE INDEX idx_reports_industry ON reports(industry);
CREATE INDEX idx_reports_concept_focus ON reports(concept_focus); -- Added index
CREATE INDEX idx_leads_report_id ON leads(report_id);
CREATE INDEX idx_leads_concept_focus ON leads(concept_focus); -- Added index